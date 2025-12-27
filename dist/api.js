/**
 * API client for GLM (Zhipu AI / BigModel)
 */
export class GLMApiClient {
    apiKey;
    model;
    baseURL;
    constructor(options) {
        this.apiKey = options.apiKey;
        this.model = options.model || 'glm-4-plus';
        // Use the Anthropic-compatible endpoint for GLM
        this.baseURL = options.baseURL || 'https://api.z.ai/api/anthropic';
    }
    /**
     * Format messages for Anthropic-compatible API
     * Extracts system message separately and returns only user/assistant messages
     */
    formatMessages(messages) {
        const systemMsg = messages.find((m) => m.role === 'system');
        const conversationMsgs = messages
            .filter((m) => m.role !== 'system')
            .map((msg) => ({
            role: msg.role,
            content: msg.content,
        }));
        return {
            system: systemMsg?.content || '',
            messages: conversationMsgs,
        };
    }
    /**
     * Extract tool calls from Anthropic-style response if present
     */
    extractToolCalls(response) {
        if (!response.content || response.content.length === 0) {
            return [];
        }
        return response.content
            .filter((block) => block.type === 'tool_use')
            .map((block) => {
            const toolUse = block;
            return {
                id: toolUse.id,
                name: toolUse.name,
                input: toolUse.input,
            };
        });
    }
    /**
     * Parse tool call arguments
     */
    parseToolArgs(argsString) {
        try {
            return JSON.parse(argsString);
        }
        catch (error) {
            console.error('Failed to parse tool args:', error);
            return {};
        }
    }
    /**
     * Create a chat completion request using Anthropic-compatible API
     */
    async createChatCompletion(messages, options) {
        // Format messages for Anthropic API (system separate from messages)
        const { system, messages: formattedMessages } = this.formatMessages(messages);
        // Build request body
        const body = {
            model: this.model,
            messages: formattedMessages,
            max_tokens: options?.maxTokens || 4096,
            temperature: options?.temperature || 0.7,
        };
        // Add system prompt if present
        if (system) {
            body.system = system;
        }
        // Add tools if provided
        if (options?.tools && options.tools.length > 0) {
            body.tools = options.tools;
        }
        // Use Anthropic-compatible endpoint path
        const response = await fetch(`${this.baseURL}/v1/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`GLM API error: ${response.status} ${response.statusText}\n${errorText}`);
        }
        const data = await response.json();
        // Check for API error format (Zhipu AI error responses)
        if ('code' in data && data.code && !data.success) {
            throw new Error(`GLM API error: ${data.code} - ${data.msg || 'Unknown error'}`);
        }
        return data;
    }
    /**
     * Extract text content from Anthropic-style response
     */
    extractContent(response) {
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
     * Get finish reason from Anthropic-style response
     */
    getFinishReason(response) {
        return response.stop_reason || 'stop';
    }
    /**
     * Get usage info from Anthropic-style response
     */
    getUsage(response) {
        const usage = response.usage;
        return {
            promptTokens: usage?.input_tokens || 0,
            completionTokens: usage?.output_tokens || 0,
            totalTokens: (usage?.input_tokens || 0) + (usage?.output_tokens || 0),
        };
    }
}
//# sourceMappingURL=api.js.map