import { injectable, inject } from 'inversify';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { dependencies } from '@/dependencies.js';
import {
    createSessionSchema,
    deleteSessionSchema,
    performActionSchema,
} from "@/schemas.js";
import type { AxisService } from "../axis/index.js";

@injectable()
export class McpService {
    constructor(@inject(dependencies.AxisService) private readonly axisService: AxisService) {}

    createServer(): McpServer {
        const server = new McpServer({
            name: "compass",
            version: "1.0.0",
        });

        this.registerTools(server);

        return server;
    }

    private registerTools(server: McpServer): void {
        server.registerTool(
            "create_session",
            {
                description: "Create a new browser session and navigate to a URL",
                inputSchema: createSessionSchema,
            },
            async ({ url }) => {
                const result = await this.axisService.createSession(url);

                const content: any[] = [
                    {
                        type: "text",
                        text: `Session created successfully!\nSession ID: ${result.payload.id}\nCreated: ${result.payload.createDate}`,
                    },
                ];

                const screenshot = await this.axisService.captureScreenshot(result.payload.id);
                if (screenshot) {
                    content.push({
                        type: "image",
                        data: screenshot,
                        mimeType: "image/png",
                    });
                }

                return { content };
            }
        );

        server.registerTool(
            "delete_session",
            {
                description: "Delete an existing browser session",
                inputSchema: deleteSessionSchema,
            },
            async ({ sessionId }) => {
                const result = await this.axisService.deleteSession(sessionId);
                return {
                    content: [
                        {
                            type: "text",
                            text: `Session ${result.payload.id} deleted successfully`,
                        },
                    ],
                };
            }
        );

        server.registerTool(
            "perform_action",
            {
                description: "Perform an action in a browser session (click or open-page)",
                inputSchema: performActionSchema,
            },
            async ({ sessionId, action }) => {
                const result = await this.axisService.performAction(sessionId, action);

                const content: any[] = [
                    {
                        type: "text",
                        text: `${result.message}\nAction: ${JSON.stringify(result.payload, null, 2)}`,
                    },
                ];

                const screenshot = await this.axisService.captureScreenshot(sessionId);
                if (screenshot) {
                    content.push({
                        type: "image",
                        data: screenshot,
                        mimeType: "image/png",
                    });
                }

                return { content };
            }
        );
    }
}
