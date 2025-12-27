/**
 * GLM Agent SDK
 * Compatible with @anthropic-ai/claude-agent-sdk
 *
 * Uses GLM API (Zhipu AI / BigModel) instead of Anthropic API
 */
import type { SdkOptions, SDKMessage } from './types';
export type { SdkOptions, SDKMessage };
/**
 * Options for the query function
 */
export type QueryOptions = {
    prompt: string;
    options?: SdkOptions;
};
/**
 * Main query function - compatible with claude-agent-sdk
 */
export declare function query({ prompt, options }: QueryOptions): AsyncGenerator<SDKMessage>;
//# sourceMappingURL=index.d.ts.map