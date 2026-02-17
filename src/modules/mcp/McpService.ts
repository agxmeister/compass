import { randomUUID } from 'crypto';
import { injectable, inject, multiInject } from 'inversify';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { dependencies } from '@/dependencies.js';
import { Logger as LoggerInterface, LoggerFactory } from '@/modules/logging/index.js';
import type { Tool } from './types.js';

@injectable()
export class McpService {
    private readonly logger: LoggerInterface;

    constructor(
        @multiInject(dependencies.Tools) private readonly tools: Tool[],
        @inject(dependencies.LoggerFactory) loggerFactory: LoggerFactory,
    ) {
        this.logger = loggerFactory.createLogger();
    }

    createServer(): McpServer {
        const server = new McpServer({
            name: "compass",
            version: "1.0.0",
        });

        this.registerTools(server);

        return server;
    }

    private registerTools(server: McpServer): void {
        for (const tool of this.tools) {
            server.registerTool(
                tool.name,
                {
                    description: tool.description,
                    inputSchema: tool.inputSchema,
                },
                async (args) => {
                    const traceId = randomUUID();
                    this.logger.info('Tool execution requested', { traceId, tool: tool.name, input: args });

                    try {
                        const output = await tool.execute(args);
                        this.logger.info('Tool execution completed', { traceId, tool: tool.name, output: output.data });

                        const content: CallToolResult['content'] = [
                            { type: "text", text: JSON.stringify(output.data, null, 4) },
                        ];
                        if (output.screenshot) {
                            content.push({ type: "image", data: output.screenshot, mimeType: "image/png" });
                        }
                        return { content };
                    } catch (error) {
                        this.logger.error('Tool execution failed', { traceId, tool: tool.name, error });
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                                },
                            ],
                            isError: true,
                        };
                    }
                }
            );

            this.logger.info('Tool registered', { tool: tool.name });
        }
    }
}
