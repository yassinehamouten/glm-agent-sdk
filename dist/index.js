/**
 * GLM Agent SDK
 * Compatible with @anthropic-ai/claude-agent-sdk
 *
 * Uses GLM API (Zhipu AI / BigModel) instead of Anthropic API
 */
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { GLMApiClient } from './api';
import { convertToolsToGLM, formatToolResults, STANDARD_TOOLS } from './tools';
import { extractTextContent, extractAndFormatToolCalls, calculateCost, hasToolCalls, } from './parser';
/**
 * Main query function - compatible with claude-agent-sdk
 */
export async function* query({ prompt, options = {} }) {
    const startTime = Date.now();
    // Send initialization message
    const sessionId = randomUUID();
    // Allow custom model via env var, fallback to glm-4-plus
    const defaultModel = process.env.GLM_MODEL || process.env.ANTHROPIC_MODEL || 'glm-4-plus';
    const model = options.model || defaultModel;
    yield {
        type: 'system',
        subtype: 'init',
        message: 'GLM Code initialized',
        model,
        session_id: sessionId,
    };
    // Initialize API client
    const apiKey = process.env.GLM_API_KEY || process.env.ANTHROPIC_API_KEY || '';
    if (!apiKey) {
        throw new Error('GLM_API_KEY or ANTHROPIC_API_KEY environment variable is required');
    }
    const apiClient = new GLMApiClient({
        apiKey,
        model,
        baseURL: process.env.GLM_BASE_URL || process.env.ANTHROPIC_BASE_URL,
    });
    // Build initial messages
    const messages = [
        {
            role: 'system',
            content: buildSystemPrompt(options.systemPrompt),
        },
        {
            role: 'user',
            content: prompt,
        },
    ];
    // Determine available tools
    const allowedTools = options.allowedTools || [];
    const disallowedTools = options.disallowedTools || [];
    // Filter standard tools
    let availableTools = STANDARD_TOOLS;
    if (allowedTools.length > 0) {
        availableTools = availableTools.filter((t) => allowedTools.includes(t.name));
    }
    if (disallowedTools.length > 0) {
        availableTools = availableTools.filter((t) => !disallowedTools.includes(t.name));
    }
    const glmTools = convertToolsToGLM(availableTools);
    // Conversation loop
    let turnIndex = 0;
    const maxTurns = options.maxTurns || 10;
    while (turnIndex < maxTurns) {
        try {
            // Call GLM API
            const response = await apiClient.createChatCompletion(messages, {
                tools: glmTools.length > 0 ? glmTools : undefined,
            });
            // Log raw response for debugging
            console.error('[DEBUG] Raw GLM response:', JSON.stringify(response, null, 2));
            // Extract and display text content
            const textContent = extractTextContent(response);
            if (textContent) {
                yield {
                    type: 'user',
                    content: textContent,
                };
            }
            // Check if there are tool calls
            if (hasToolCalls(response)) {
                const toolCalls = extractAndFormatToolCalls(response);
                // Execute each tool call
                const toolResults = [];
                for (const toolCall of toolCalls) {
                    const result = await executeToolCall(toolCall.name, toolCall.input);
                    toolResults.push({
                        toolCallId: randomUUID(),
                        content: result,
                    });
                    // Send result as user message
                    yield {
                        type: 'user',
                        content: `${toolCall.name}: ${result}`,
                    };
                }
                // Add results to messages for next turn
                const formattedResults = formatToolResults(toolResults);
                for (const result of formattedResults) {
                    messages.push({
                        role: 'user',
                        content: result.content,
                    });
                }
                turnIndex++;
                continue;
            }
            // No tool calls - end conversation
            break;
        }
        catch (error) {
            // Error - send error message
            const errorMessage = error instanceof Error ? error.message : String(error);
            yield {
                type: 'result',
                subtype: 'error',
                is_error: true,
                duration_ms: Date.now() - startTime,
                num_turns: turnIndex + 1,
                errors: [errorMessage],
            };
            return;
        }
    }
    // Success - send final result
    const durationMs = Date.now() - startTime;
    // Try to calculate cost (approximate)
    let totalCostUsd;
    try {
        const lastResponse = await apiClient.createChatCompletion([{ role: 'user', content: 'test' }], { maxTokens: 1 });
        const usage = apiClient.getUsage(lastResponse);
        totalCostUsd = calculateCost(usage.promptTokens, usage.completionTokens, model);
    }
    catch {
        // Ignore cost calculation errors
    }
    yield {
        type: 'result',
        subtype: 'success',
        is_error: false,
        duration_ms: durationMs,
        num_turns: turnIndex + 1,
        total_cost_usd: totalCostUsd,
    };
}
/**
 * Build system prompt
 */
function buildSystemPrompt(systemPrompt) {
    const basePrompt = `You are a helpful AI assistant with access to tools.
When you need to execute code or commands, use the appropriate tools.
Respond in a concise and helpful manner.`;
    if (!systemPrompt) {
        return basePrompt;
    }
    if (typeof systemPrompt === 'string') {
        return systemPrompt;
    }
    if (systemPrompt.type === 'preset') {
        let prompt = basePrompt;
        if (systemPrompt.append) {
            prompt += `\n\n${systemPrompt.append}`;
        }
        return prompt;
    }
    return basePrompt;
}
/**
 * Execute a tool call
 */
async function executeToolCall(name, input) {
    try {
        switch (name) {
            case 'Bash': {
                const command = String(input.command || '');
                if (!command) {
                    return 'Error: No command provided';
                }
                try {
                    const output = execSync(command, {
                        encoding: 'utf-8',
                        maxBuffer: 10 * 1024 * 1024, // 10MB
                        timeout: 30000, // 30 seconds
                    });
                    return output;
                }
                catch (error) {
                    const err = error;
                    return `Error: ${err.message || 'Command failed'}\n${err.stderr || ''}`;
                }
            }
            case 'read_file': {
                const filePath = String(input.file_path || '');
                if (!filePath) {
                    return 'Error: No file_path provided';
                }
                try {
                    const content = await readFile(filePath, 'utf-8');
                    return content;
                }
                catch (error) {
                    const err = error;
                    return `Error reading file: ${err.message}`;
                }
            }
            case 'write_file': {
                const filePath = String(input.file_path || '');
                const content = String(input.content || '');
                if (!filePath) {
                    return 'Error: No file_path provided';
                }
                try {
                    const { writeFile } = await import('node:fs/promises');
                    await writeFile(filePath, content, 'utf-8');
                    return `Successfully wrote ${content.length} characters to ${filePath}`;
                }
                catch (error) {
                    const err = error;
                    return `Error writing file: ${err.message}`;
                }
            }
            default:
                return `Error: Unknown tool '${name}'`;
        }
    }
    catch (error) {
        const err = error;
        return `Error executing ${name}: ${err.message}`;
    }
}
//# sourceMappingURL=index.js.map