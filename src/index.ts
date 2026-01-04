import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "dotenv";
import 'reflect-metadata';
import { container } from "./container.js";
import { dependencies } from "./dependencies.js";
import type { McpService } from "./modules/mcp/index.js";

config();

const mcpService = container.get<McpService>(dependencies.McpService);
const server = mcpService.createServer();

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((_) => {
    process.exit(1);
});
