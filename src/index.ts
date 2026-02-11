import 'dotenv/config';
import 'reflect-metadata';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { container } from "./container.js";
import { dependencies } from "./dependencies.js";
import type { McpService } from "./modules/mcp/index.js";
import type { ToolDiscoveryService } from "./modules/mcp/index.js";

async function main() {
    try {
        const discoveryService = container.get<ToolDiscoveryService>(dependencies.ToolDiscoveryService);
        await discoveryService.discoverTools();

        const mcpService = container.get<McpService>(dependencies.McpService);
        const server = mcpService.createServer();

        const transport = new StdioServerTransport();
        await server.connect(transport);
    } catch {
        process.exit(1);
    }
}

main().catch((_) => {
    process.exit(1);
});
