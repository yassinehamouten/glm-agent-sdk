/**
 * Parser for GLM Anthropic-compatible API responses
 * Converts Anthropic-style responses to SDK-compatible messages
 */
/**
 * Create a result SDK message
 */
export function createResultMessage(turnIndex, durationMs, isSuccess, errors) {
    return {
        type: 'result',
        subtype: isSuccess ? 'success' : 'error',
        is_error: !isSuccess,
        duration_ms: durationMs,
        num_turns: turnIndex + 1,
        errors,
    };
}
/**
 * Extract text content from a GLM Anthropic-style response
 */
export function extractTextContent(response) {
    // Anthropic-style response has content array
    if (!response.content || response.content.length === 0) {
        return '';
    }
    // Extract all text blocks and concatenate them
    const textBlocks = response.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text);
    return textBlocks.join('');
}
/**
 * Check if response contains tool calls
 */
export function hasToolCalls(response) {
    if (!response.content || response.content.length === 0) {
        return false;
    }
    return response.content.some((block) => block.type === 'tool_use');
}
/**
 * Extract and format tool calls from a GLM Anthropic-style response
 */
export function extractAndFormatToolCalls(response) {
    if (!response.content || response.content.length === 0) {
        return [];
    }
    const toolUseBlocks = response.content.filter((block) => block.type === 'tool_use');
    return toolUseBlocks.map((block) => ({
        name: block.name,
        input: block.input,
        id: block.id,
    }));
}
/**
 * Generate a user message for a tool result
 */
export function generateToolResultMessage(toolName, result) {
    return `Tool ${toolName} returned: ${result}`;
}
/**
 * Calculate approximate cost in USD based on tokens
 */
export function calculateCost(promptTokens, completionTokens, model) {
    // Approximate pricing for GLM models (adjust according to actual rates)
    const prices = {
        'glm-4-plus': { input: 0.00001, output: 0.00002 },
        'glm-4': { input: 0.00001, output: 0.00002 },
        'glm-4-0520': { input: 0.00001, output: 0.00002 },
        'glm-4-0529': { input: 0.00001, output: 0.00002 },
        'glm-4-air': { input: 0.00001, output: 0.00002 },
        'glm-4-flash': { input: 0.000001, output: 0.000002 },
        'glm-4-long': { input: 0.000005, output: 0.00001 },
    };
    // Try exact match first, then prefix match for versioned models
    let pricing = prices[model];
    if (!pricing) {
        // Match prefix (e.g., "glm-4-0520" -> "glm-4")
        const prefix = model.split('-').slice(0, 2).join('-');
        pricing = prices[prefix] || prices['glm-4'];
    }
    const inputCost = (promptTokens / 1000) * pricing.input;
    const outputCost = (completionTokens / 1000) * pricing.output;
    return inputCost + outputCost;
}
//# sourceMappingURL=parser.js.map