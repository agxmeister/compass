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
export default class OpenPageTool implements Tool {
    readonly name = "open_page";
    readonly description = "Navigate to a URL in an existing browser session";
    readonly inputSchema = {
        sessionId: zod.string().describe("The ID of the session"),
        url: zod.string().describe("URL to navigate to"),
    };

    constructor(
        @inject(dependencies.ToolExecutor) private readonly toolExecutor: ToolExecutor,
        @inject(dependencies.ToolResultBuilderFactory) private readonly toolResultBuilderFactory: ToolResultBuilderFactory,
        @inject(dependencies.BrowserServiceFactory) private readonly browserServiceFactory: BrowserServiceFactory,
    ) {}

    async execute(args: { sessionId: string; url: string }): Promise<CallToolResult> {
        const action = { type: "open-page" as const, url: args.url };
        return this.toolExecutor.execute(async (protocolRecordBuilder) => {
            const browserService = this.browserServiceFactory.create(protocolRecordBuilder);
            const response = await browserService.performAction(args.sessionId, action);
            const screenshot = await browserService.captureScreenshot(args.sessionId);
            return this.toolResultBuilderFactory.create(protocolRecordBuilder)
                .setResponse(response as unknown as Record<string, unknown>)
                .setText(`${response.message}\nPage: ${JSON.stringify(response.payload, null, 4)}`)
                .setScreenshot(screenshot)
                .build();
        });
    }
}
