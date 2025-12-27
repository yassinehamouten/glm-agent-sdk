/**
 * Tool handling for GLM
 * Compatible with Claude Code tool format
 */
/**
 * Convert tools to Anthropic-compatible format
 * The GLM Anthropic-compatible API expects:
 * {
 *   "name": "tool_name",
 *   "description": "...",
 *   "input_schema": {...}
 * }
 */
export function convertToolsToGLM(tools) {
    return tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema,
    }));
}
/**
 * Extract tool calls from GLM response and convert them
 */
export function extractToolCalls(glmToolCalls) {
    if (!glmToolCalls)
        return [];
    return glmToolCalls
        .filter((tc) => tc != null)
        .map((tc) => {
        let args = {};
        try {
            args = JSON.parse(tc.function.arguments);
        }
        catch {
            // If parsing fails, keep empty object
        }
        return {
            name: tc.function.name,
            input: args,
        };
    });
}
/**
 * Format tool results to send back to GLM
 */
export function formatToolResults(results) {
    return results.map((result) => {
        const content = result.isError
            ? `Error: ${result.content}`
            : result.content;
        return {
            role: 'tool',
            content,
        };
    });
}
/**
 * Standard available tools (Bash, gh, etc.)
 */
export const STANDARD_TOOLS = [
    {
        name: 'Bash',
        description: 'Execute a Bash command in a terminal',
        inputSchema: {
            type: 'object',
            properties: {
                command: {
                    type: 'string',
                    description: 'The command to execute',
                },
            },
            required: ['command'],
        },
    },
    {
        name: 'read_file',
        description: 'Read the contents of a file',
        inputSchema: {
            type: 'object',
            properties: {
                file_path: {
                    type: 'string',
                    description: 'The path to the file to read',
                },
            },
            required: ['file_path'],
        },
    },
    {
        name: 'write_file',
        description: 'Write content to a file',
        inputSchema: {
            type: 'object',
            properties: {
                file_path: {
                    type: 'string',
                    description: 'The path to the file to write',
                },
                content: {
                    type: 'string',
                    description: 'The content to write',
                },
            },
            required: ['file_path', 'content'],
        },
    },
];
//# sourceMappingURL=tools.js.map