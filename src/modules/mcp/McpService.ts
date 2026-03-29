import { v4 as uuid } from 'uuid';
import { injectable, inject, multiInject } from 'inversify';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { dependencies } from '@/dependencies.js';
import { Logger as LoggerInterface, LoggerFactory } from '@/modules/log/index.js';
import type { ToolGroup, ToolOutput } from './types.js';

@injectable()
export class McpService {
    private readonly logger: LoggerInterface;

    constructor(
        @multiInject(dependencies.ToolGroups) private readonly toolGroups: ToolGroup[],
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
        for (const group of this.toolGroups) {
            for (const tool of group.tools) {
                server.registerTool(
                    tool.name,
                    {
                        description: tool.description,
                        inputSchema: tool.inputSchema,
                    },
                    async (args) => {
                        const traceId = uuid();
                        this.logger.info('Tool execution requested', { traceId, tool: tool.name, input: args });

                        try {
                            const output: ToolOutput = await group.toolService.execute(
                                async (context) => tool.handle(args, context),
                            );
                            this.logger.info('Tool execution completed', { traceId, tool: tool.name });
                            return {
                                content: [
                                    ...output.getTexts().map(text => ({ type: "text" as const, text })),
                                    ...output.getImages().map(data => ({ type: "image" as const, data, mimeType: "image/png" })),
                                ]
                            }
                        } catch (error) {
                            this.logger.error('Tool execution failed', { traceId, tool: tool.name, error });
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }, null, 4),
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
}
