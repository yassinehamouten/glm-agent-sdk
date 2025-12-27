# GLM Agent SDK

![](https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=flat-square) [![npm](https://img.shields.io/npm/v/@yassinehamouten/glm-agent-sdk?style=flat-square)](https://www.npmjs.com/package/@yassinehamouten/glm-agent-sdk)

A TypeScript SDK for building AI agents with **GLM API** (Zhipu AI / BigModel). Create autonomous agents that can understand codebases, edit files, run commands, and execute complex workflows.

## Why GLM Agent SDK?

- **Cost-effective**: GLM models offer competitive pricing
- **Flexible models**: Support for `glm-4-plus`, `glm-4`, `glm-4.7`, `glm-4-air`, `glm-4-flash`, and more
- **Tool calling**: Built-in support for Bash, file operations, and custom tools
- **TypeScript**: Fully typed for great developer experience

## Get started

Install the GLM Agent SDK:

```sh
npm install @yassinehamouten/glm-agent-sdk
```

## Usage

```typescript
import { query } from '@yassinehamouten/glm-agent-sdk';

async function runAgent() {
  const generator = query({
    prompt: 'Analyze this codebase and suggest improvements',
    options: {
      model: 'glm-4.7',
      maxTurns: 10,
    }
  });

  for await (const message of generator) {
    switch (message.type) {
      case 'system':
        console.log('System:', message.message);
        break;
      case 'user':
        console.log('Agent:', message.content);
        break;
      case 'result':
        if (message.subtype === 'success') {
          console.log('✅ Success in', message.duration_ms, 'ms');
        } else {
          console.log('❌ Error:', message.errors);
        }
        break;
    }
  }
}
```

## Configuration

Set your GLM API key as an environment variable:

```bash
export GLM_API_KEY="your-api-key-here"
export GLM_MODEL="glm-4.7"  # Optional, defaults to glm-4-plus
```

You can also use `ANTHROPIC_API_KEY` and `ANTHROPIC_MODEL` if you have those set up.

### Available Models

- `glm-4-plus` - Most capable model (default)
- `glm-4` - High-performance model
- `glm-4.7` - Latest version (recommended)
- `glm-4-air` - Faster, more cost-effective
- `glm-4-flash` - Fastest for simple tasks
- `glm-4-long` - Extended context window

See [Zhipu AI documentation](https://open.bigmodel.cn/dev/api) for the full list of models.

## Tools

The SDK includes built-in tools that the agent can use:

| Tool | Description |
|------|-------------|
| `Bash` | Execute shell commands |
| `read_file` | Read file contents |
| `write_file` | Write content to files |

You can control which tools are available:

```typescript
const generator = query({
  prompt: 'List all files in the current directory',
  options: {
    allowedTools: ['Bash'],  // Only allow Bash
    // or
    disallowedTools: ['write_file'],  // Disable write_file
  }
});
```

## Features

This SDK provides a complete agent building experience:

| Feature | Status |
|---------|--------|
| `query()` async generator | ✅ |
| SDK message format | ✅ |
| Tool calling | ✅ |
| Multi-turn conversations | ✅ |
| System prompts | ✅ |
| Error handling | ✅ |
| Cost tracking | ✅ |

## Advanced Usage

### Custom System Prompt

```typescript
const generator = query({
  prompt: 'Write a function to sort an array',
  options: {
    systemPrompt: 'You are an expert TypeScript developer. Always include type annotations.',
  }
});
```

### Limit Conversation Turns

```typescript
const generator = query({
  prompt: 'Refactor this code',
  options: {
    maxTurns: 5,  // Maximum 5 tool calls
  }
});
```

## API Endpoint

This SDK uses the **GLM Anthropic-compatible API** at `https://api.z.ai/api/anthropic`, which provides an Anthropic-compatible interface for GLM models. This allows drop-in compatibility with tools designed for Anthropic's API.

## License

MIT © [Yassine Hamouten](https://github.com/yassinehamouten)

## Links

- **GitHub**: [yassinehamouten/glm-agent-sdk](https://github.com/yassinehamouten/glm-agent-sdk)
- **npm**: [@yassinehamouten/glm-agent-sdk](https://www.npmjs.com/package/@yassinehamouten/glm-agent-sdk)
- **GLM API Docs**: [Zhipu AI Open Platform](https://open.bigmodel.cn/dev/api)

## Support

- **Issues**: [GitHub Issues](https://github.com/yassinehamouten/glm-agent-sdk/issues)
- **Zhipu AI**: [open.bigmodel.cn](https://open.bigmodel.cn)
