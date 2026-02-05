import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { ToolExecutor } from '../ToolExecutor.js';
import type { ToolResultBuilderFactory } from '@/modules/mcp/index.js';
import type { Tool } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { BrowserServiceFactory } from '@/modules/browser/index.js';
import { RegisterTool } from '../decorators.js';

@RegisterTool()
@injectable()
export default class CreateSessionTool implements Tool {
    readonly name = "create_session";
    readonly description = "Create a new browser session and navigate to a URL";
    readonly inputSchema = {
        url: zod.string().describe("The URL to navigate to"),
    };

    constructor(
        @inject(dependencies.ToolExecutor) private readonly toolExecutor: ToolExecutor,
        @inject(dependencies.ToolResultBuilderFactory) private readonly toolResultBuilderFactory: ToolResultBuilderFactory,
        @inject(dependencies.BrowserServiceFactory) private readonly browserServiceFactory: BrowserServiceFactory,
    ) {}

    async execute(args: { url: string }): Promise<CallToolResult> {
        return this.toolExecutor.execute(async (protocolRecordBuilder) => {
            const browserService = this.browserServiceFactory.create(protocolRecordBuilder);
            const response = await browserService.createSession(args.url);
            const screenshot = await browserService.captureScreenshot(response.payload.id);
            return this.toolResultBuilderFactory.create(protocolRecordBuilder)
                .setResponse(response as unknown as Record<string, unknown>)
                .setText(`Session created successfully!\nSession ID: ${response.payload.id}\nCreated: ${response.payload.createDate}`)
                .setScreenshot(screenshot)
                .build();
        });
    }
}
