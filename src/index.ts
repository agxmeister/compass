import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "dotenv";
import { AxisService } from "./modules/axis/index.js";
import { McpService } from "./modules/mcp/index.js";

config();

const axisService = new AxisService(process.env.AXIS_API_URL!);
const mcpService = new McpService(axisService);
const server = mcpService.createServer();

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((_) => {
    process.exit(1);
});
