import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { ToolExecutor } from '../ToolExecutor.js';
import type { ToolResultBuilderFactory } from '@/modules/mcp/index.js';
import type { Tool, ToolInput } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { BrowserServiceFactory } from '@/modules/browser/index.js';
import { RegisterTool } from '../decorators.js';

const inputSchema = {
    sessionId: zod.string().describe("The ID of the session"),
    url: zod.string().describe("URL to navigate to"),
};

@RegisterTool()
@injectable()
export default class OpenPageTool implements Tool<typeof inputSchema> {
    readonly name = "open_page";
    readonly description = "Navigate to a URL in an existing browser session";
    readonly inputSchema = inputSchema;

    constructor(
        @inject(dependencies.ToolExecutor) private readonly toolExecutor: ToolExecutor,
        @inject(dependencies.ToolResultBuilderFactory) private readonly toolResultBuilderFactory: ToolResultBuilderFactory,
        @inject(dependencies.BrowserServiceFactory) private readonly browserServiceFactory: BrowserServiceFactory,
    ) {}

    async execute(args: ToolInput<typeof inputSchema>): Promise<CallToolResult> {
        return this.toolExecutor.execute(async (protocolRecordBuilder) => {
            const browserService = this.browserServiceFactory.create(protocolRecordBuilder);
            const response = await browserService.performAction(args.sessionId, {
                type: "open-page" as const,
                url: args.url
            });
            const screenshot = await browserService.captureScreenshot(args.sessionId);
            return this.toolResultBuilderFactory.create()
                .setText(JSON.stringify(response, null, 4))
                .setScreenshot(screenshot)
                .build();
        });
    }
}
