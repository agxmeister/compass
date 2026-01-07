import { Container } from 'inversify';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { dependencies } from './dependencies.js';
import { AxisService } from './modules/axis/index.js';
import { McpService, ToolDiscoveryService, CallToolResultBuilder } from './modules/mcp/index.js';

export const container = new Container();

const __dirname = dirname(fileURLToPath(import.meta.url));
const toolsDirectory = join(__dirname, 'modules', 'mcp', 'tools');

container.bind<string>(dependencies.AxisApiUrl).toConstantValue(process.env.AXIS_API_URL!);
container.bind<string>(dependencies.ToolsDirectory).toConstantValue(toolsDirectory);
container.bind<AxisService>(dependencies.AxisService).to(AxisService);
container.bind<McpService>(dependencies.McpService).to(McpService);
container.bind<ToolDiscoveryService>(dependencies.ToolDiscoveryService).to(ToolDiscoveryService);
container.bind<CallToolResultBuilder>(dependencies.CallToolResultBuilder).to(CallToolResultBuilder);
