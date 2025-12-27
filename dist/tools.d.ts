/**
 * Tool handling for GLM
 * Compatible with Claude Code tool format
 */
import type { ToolCall, ToolResult } from './types';
/**
 * Tool definition
 */
export type Tool = {
    name: string;
    description?: string;
    inputSchema: Record<string, unknown>;
};
/**
 * Convert tools to Anthropic-compatible format
 * The GLM Anthropic-compatible API expects:
 * {
 *   "name": "tool_name",
 *   "description": "...",
 *   "input_schema": {...}
 * }
 */
export declare function convertToolsToGLM(tools: Tool[]): Array<{
    name: string;
    description?: string;
    input_schema: Record<string, unknown>;
}>;
/**
 * Extract tool calls from GLM response and convert them
 */
export declare function extractToolCalls(glmToolCalls: Array<{
    id: string;
    type: string;
    function: {
        name: string;
        arguments: string;
    };
} | null | undefined>): ToolCall[];
/**
 * Format tool results to send back to GLM
 */
export declare function formatToolResults(results: ToolResult[]): Array<{
    role: string;
    content: string;
}>;
/**
 * Standard available tools (Bash, gh, etc.)
 */
export declare const STANDARD_TOOLS: Tool[];
//# sourceMappingURL=tools.d.ts.map