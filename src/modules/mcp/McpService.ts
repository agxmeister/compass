import { injectable, multiInject } from 'inversify';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { dependencies } from '@/dependencies.js';
import type { Tool } from './types.js';

@injectable()
export class McpService {
    constructor(@multiInject(dependencies.Tools) private readonly tools: Tool[]) {}

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
                    try {
                        return await tool.execute(args);
                    } catch (error) {
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                                },
                            ],
                        };
                    }
                }
            );
        }
    }
}
