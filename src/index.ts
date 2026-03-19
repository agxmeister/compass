import 'dotenv/config';
import 'reflect-metadata';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { container } from "./container.js";
import { dependencies } from "./dependencies.js";
import type { McpService } from "./modules/mcp/index.js";
import type { ToolDiscoveryService } from "./modules/mcp/index.js";
import type { LoggerFactory } from "./modules/log/index.js";

const logger = container.get<LoggerFactory>(dependencies.LoggerFactory).createLogger();

async function main() {
    try {
        const discoveryService = container.get<ToolDiscoveryService>(dependencies.ToolDiscoveryService);
        await discoveryService.discoverTools();

        const mcpService = container.get<McpService>(dependencies.McpService);
        const server = mcpService.createServer();

        const transport = new StdioServerTransport();
        await server.connect(transport);
    } catch (error) {
        logger.error("Failed to start server", { error: error instanceof Error ? error.message : String(error) });
        process.exit(1);
    }
}

main().catch((error) => {
    logger.error("Unexpected error", { error: error instanceof Error ? error.message : String(error) });
    process.exit(1);
});
