import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "dotenv";
import {
    createSessionSchema,
    deleteSessionSchema,
    performActionSchema,
} from "./schemas.js";
import { AxisService } from "./modules/axis/index.js";

config();

const axisService = new AxisService(process.env.AXIS_API_URL!);

const server = new McpServer({
    name: "compass",
    version: "1.0.0",
});

server.registerTool(
    "create_session",
    {
        description: "Create a new browser session and navigate to a URL",
        inputSchema: createSessionSchema,
    },
    async ({ url }) => {
        const result = await axisService.createSession(url);

        const content: any[] = [
            {
                type: "text",
                text: `Session created successfully!\nSession ID: ${result.payload.id}\nCreated: ${result.payload.createDate}`,
            },
        ];

        const screenshot = await axisService.captureScreenshot(result.payload.id);
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
        const result = await axisService.deleteSession(sessionId);
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
        const result = await axisService.performAction(sessionId, action);

        const content: any[] = [
            {
                type: "text",
                text: `${result.message}\nAction: ${JSON.stringify(result.payload, null, 2)}`,
            },
        ];

        const screenshot = await axisService.captureScreenshot(sessionId);
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

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Compass MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
