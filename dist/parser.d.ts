/**
 * Parser for GLM Anthropic-compatible API responses
 * Converts Anthropic-style responses to SDK-compatible messages
 */
import type { GLMResponse, SDKMessage } from './types';
/**
 * Create a result SDK message
 */
export declare function createResultMessage(turnIndex: number, durationMs: number, isSuccess: boolean, errors?: string[]): SDKMessage;
/**
 * Extract text content from a GLM Anthropic-style response
 */
export declare function extractTextContent(response: GLMResponse): string;
/**
 * Check if response contains tool calls
 */
export declare function hasToolCalls(response: GLMResponse): boolean;
/**
 * Extract and format tool calls from a GLM Anthropic-style response
 */
export declare function extractAndFormatToolCalls(response: GLMResponse): {
    name: string;
    input: Record<string, unknown>;
    id: string;
}[];
/**
 * Generate a user message for a tool result
 */
export declare function generateToolResultMessage(toolName: string, result: string): string;
/**
 * Calculate approximate cost in USD based on tokens
 */
export declare function calculateCost(promptTokens: number, completionTokens: number, model: string): number;
//# sourceMappingURL=parser.d.ts.map