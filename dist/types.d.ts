/**
 * Types compatible with @anthropic-ai/claude-agent-sdk
 */
export type ToolCall = {
    name: string;
    input: Record<string, unknown>;
};
export type ToolResult = {
    toolCallId: string;
    content: string;
    isError?: boolean;
};
export type ContentBlock = {
    type: 'text';
    text: string;
} | {
    type: 'tool_use';
    id: string;
    name: string;
    input: Record<string, unknown>;
} | {
    type: 'tool_result';
    tool_use_id: string;
    content?: string;
    is_error?: boolean;
};
export type SDKMessage = {
    type: 'system';
    subtype?: 'init';
    message?: string;
    model?: string;
    session_id?: string;
} | {
    type: 'user';
    content: string;
} | {
    type: 'result';
    subtype: 'success' | 'error';
    is_error: boolean;
    duration_ms: number;
    num_turns: number;
    total_cost_usd?: number;
    permission_denials?: string[];
    errors?: string[];
    structured_output?: Record<string, unknown>;
};
export type SdkOptions = {
    model?: string;
    maxTurns?: number;
    allowedTools?: string[];
    disallowedTools?: string[];
    systemPrompt?: string | {
        type: 'preset';
        preset: string;
        append?: string;
    };
    fallbackModel?: string;
    pathToClaudeCodeExecutable?: string;
    extraArgs?: Record<string, string | null>;
    env?: Record<string, string | undefined>;
    settingSources?: ('user' | 'project' | 'local')[];
};
export type GLMMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};
export type GLMToolCall = {
    id: string;
    type: 'function';
    function: {
        name: string;
        arguments: string;
    };
};
/**
 * Anthropic-style response from GLM Anthropic-compatible API
 */
export type AnthropicContentBlock = {
    type: 'text';
    text: string;
} | {
    type: 'tool_use';
    id: string;
    name: string;
    input: Record<string, unknown>;
};
export type GLMResponse = {
    id: string;
    type: string;
    role: string;
    model: string;
    content: AnthropicContentBlock[];
    stop_reason: string;
    stop_sequence: string | null;
    usage: {
        input_tokens: number;
        output_tokens: number;
        cache_read_input_tokens?: number;
    };
};
/**
 * Legacy OpenAI-style format (not used by Anthropic-compatible endpoint)
 * Kept for potential future use with other endpoints
 */
export type OpenAIStyleGLMResponse = {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        message: {
            role: string;
            content: string | null;
            tool_calls?: GLMToolCall[];
        };
        finish_reason: string;
    }>;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
};
//# sourceMappingURL=types.d.ts.map