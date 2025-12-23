import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "dotenv";
import {
    createSessionSchema,
    deleteSessionSchema,
    performActionSchema,
} from "./schemas.js";

config();

const AXIS_API_URL = process.env.AXIS_API_URL!;

async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${AXIS_API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `API request failed: ${response.statusText}`);
    }

    return data;
}

async function captureScreenshot(sessionId: string) {
    try {
        const result = await apiRequest(`/api/sessions/${sessionId}/screenshots`, {
            method: "POST",
        });

        const screenshotUrl = result.payload.url;
        const imageResponse = await fetch(screenshotUrl);

        if (imageResponse.ok) {
            const arrayBuffer = await imageResponse.arrayBuffer();
            return Buffer.from(arrayBuffer).toString('base64');
        }

        return null;
    } catch (error) {
        console.error('Failed to capture screenshot:', error);
        return null;
    }
}

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
        const result = await apiRequest("/api/sessions", {
            method: "POST",
            body: JSON.stringify({ url }),
        });

        const content: any[] = [
            {
                type: "text",
                text: `Session created successfully!\nSession ID: ${result.payload.id}\nCreated: ${result.payload.createDate}`,
            },
        ];

        const screenshot = await captureScreenshot(result.payload.id);
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
        const result = await apiRequest(`/api/sessions/${sessionId}`, {
            method: "DELETE",
        });
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
        const result = await apiRequest(`/api/sessions/${sessionId}/actions`, {
            method: "POST",
            body: JSON.stringify(action),
        });

        const content: any[] = [
            {
                type: "text",
                text: `${result.message}\nAction: ${JSON.stringify(result.payload, null, 2)}`,
            },
        ];

        const screenshot = await captureScreenshot(sessionId);
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
