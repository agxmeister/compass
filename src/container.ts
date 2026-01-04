import { Container } from 'inversify';
import { dependencies } from './dependencies.js';
import { AxisService } from './modules/axis/index.js';
import { McpService } from './modules/mcp/index.js';

export const container = new Container();

container.bind<string>(dependencies.AxisApiUrl).toConstantValue(process.env.AXIS_API_URL!);
container.bind<AxisService>(dependencies.AxisService).to(AxisService);
container.bind<McpService>(dependencies.McpService).to(McpService);
