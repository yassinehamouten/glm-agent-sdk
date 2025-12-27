/**
 * API client for GLM (Zhipu AI / BigModel)
 */
import type { GLMMessage, GLMResponse } from './types';
export interface GLMApiOptions {
    apiKey: string;
    model?: string;
    baseURL?: string;
}
export declare class GLMApiClient {
    private apiKey;
    private model;
    private baseURL;
    constructor(options: GLMApiOptions);
    /**
     * Format messages for Anthropic-compatible API
     * Extracts system message separately and returns only user/assistant messages
     */
    private formatMessages;
    /**
     * Extract tool calls from Anthropic-style response if present
     */
    extractToolCalls(response: GLMResponse): Array<{
        id: string;
        name: string;
        input: Record<string, unknown>;
    }>;
    /**
     * Parse tool call arguments
     */
    parseToolArgs(argsString: string): Record<string, unknown>;
    /**
     * Create a chat completion request using Anthropic-compatible API
     */
    createChatCompletion(messages: GLMMessage[], options?: {
        maxTokens?: number;
        temperature?: number;
        tools?: Array<{
            name: string;
            description?: string;
            input_schema: Record<string, unknown>;
        }>;
    }): Promise<GLMResponse>;
    /**
     * Extract text content from Anthropic-style response
     */
    extractContent(response: GLMResponse): string;
    /**
     * Get finish reason from Anthropic-style response
     */
    getFinishReason(response: GLMResponse): string;
    /**
     * Get usage info from Anthropic-style response
     */
    getUsage(response: GLMResponse): {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
//# sourceMappingURL=api.d.ts.map