import { Container } from 'inversify';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { dependencies } from './dependencies.js';
import { AxisServiceFactory, BrowserServiceFactory } from './modules/browser/index.js';
import { HttpServiceFactory, type HttpServiceFactoryInterface } from './modules/http/index.js';
import { McpService, ToolDiscoveryService, ToolExecutor, ToolResultBuilderFactory } from './modules/mcp/index.js';
import { LoggerFactory } from './modules/logging/index.js';
import { ProtocolService, ProtocolRepository, ScreenshotService, ScreenshotRepository, ProtocolRecordBuilderFactory, ProtocolServiceInterface, ScreenshotServiceInterface } from './modules/protocol/index.js';
import { ConfigFactory } from './modules/config/index.js';
import { HttpClientFactory, type HttpClientFactoryInterface } from './modules/http/index.js';

export const container = new Container();

const __dirname = dirname(fileURLToPath(import.meta.url));
const toolsDirectory = join(__dirname, 'modules', 'mcp', 'tools');

const configFactory = new ConfigFactory();
const config = configFactory.create();

const journeyDir = join(config.journey.dir, config.journey.name);

container.bind<string>(dependencies.AxisApiUrl).toConstantValue(config.axisApiUrl);
container.bind<string>(dependencies.ToolsDirectory).toConstantValue(toolsDirectory);
container.bind<string>(dependencies.LoggingLevel).toConstantValue(config.logging.level);
container.bind<string>(dependencies.LoggingEnvironment).toConstantValue(config.logging.environment);
container.bind<string>(dependencies.JourneyDir).toConstantValue(journeyDir);
container.bind<number>(dependencies.HttpTimeout).toConstantValue(config.http.timeout);
container.bind<HttpClientFactoryInterface>(dependencies.HttpClientFactory).to(HttpClientFactory);
container.bind<HttpServiceFactoryInterface>(dependencies.HttpServiceFactory).to(HttpServiceFactory);
container.bind<BrowserServiceFactory>(dependencies.BrowserServiceFactory).to(AxisServiceFactory);
container.bind<McpService>(dependencies.McpService).to(McpService);
container.bind<ToolDiscoveryService>(dependencies.ToolDiscoveryService).to(ToolDiscoveryService);
container.bind<LoggerFactory>(dependencies.LoggerFactory).to(LoggerFactory);
container.bind<ProtocolRepository>(dependencies.ProtocolRepository).to(ProtocolRepository).inSingletonScope();
container.bind<ProtocolServiceInterface>(dependencies.ProtocolService).to(ProtocolService);
container.bind<ProtocolRecordBuilderFactory>(dependencies.ProtocolRecordBuilderFactory).to(ProtocolRecordBuilderFactory);
container.bind<ScreenshotRepository>(dependencies.ScreenshotRepository).to(ScreenshotRepository);
container.bind<ScreenshotServiceInterface>(dependencies.ScreenshotService).to(ScreenshotService);
container.bind<ToolExecutor>(dependencies.ToolExecutor).to(ToolExecutor);
container.bind<ToolResultBuilderFactory>(dependencies.ToolResultBuilderFactory).to(ToolResultBuilderFactory);
