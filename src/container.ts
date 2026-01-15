import { Container } from 'inversify';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { dependencies } from './dependencies.js';
import { AxisService } from './modules/axis/index.js';
import { McpService, ToolDiscoveryService, CallToolResultBuilder } from './modules/mcp/index.js';
import { LoggerFactory } from './modules/logging/index.js';
import { ProtocolService, ProtocolRepository, ScreenshotService, ProtocolRecordBuilder } from './modules/protocol/index.js';

export const container = new Container();

const __dirname = dirname(fileURLToPath(import.meta.url));
const toolsDirectory = join(__dirname, 'modules', 'mcp', 'tools');

container.bind<string>(dependencies.AxisApiUrl).toConstantValue(process.env.AXIS_API_URL!);
container.bind<string>(dependencies.ToolsDirectory).toConstantValue(toolsDirectory);
container.bind<string>(dependencies.LoggingLevel).toConstantValue(process.env.LOG_LEVEL || 'info');
container.bind<string>(dependencies.LoggingEnvironment).toConstantValue(process.env.LOG_ENVIRONMENT || 'development');
container.bind<string>(dependencies.LoggingDir).toConstantValue(process.env.LOG_DIR || 'data/logs');
container.bind<string>(dependencies.LoggingName).toConstantValue(process.env.LOG_NAME || 'compass.log');
container.bind<string>(dependencies.ProtocolName).toConstantValue(process.env.PROTOCOL_NAME || 'default');
container.bind<string>(dependencies.ProtocolDir).toConstantValue(process.env.PROTOCOL_DIR || 'data/protocols');
container.bind<AxisService>(dependencies.AxisService).to(AxisService);
container.bind<McpService>(dependencies.McpService).to(McpService);
container.bind<ToolDiscoveryService>(dependencies.ToolDiscoveryService).to(ToolDiscoveryService);
container.bind<CallToolResultBuilder>(dependencies.CallToolResultBuilder).to(CallToolResultBuilder);
container.bind<LoggerFactory>(dependencies.LoggerFactory).to(LoggerFactory);
container.bind<ProtocolRepository>(dependencies.ProtocolRepository).to(ProtocolRepository);
container.bind<ProtocolService>(dependencies.ProtocolService).to(ProtocolService);
container.bind<ProtocolRecordBuilder>(dependencies.ProtocolRecordBuilder).to(ProtocolRecordBuilder);
container.bind<ScreenshotService>(dependencies.ScreenshotService).to(ScreenshotService);
