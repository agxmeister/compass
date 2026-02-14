import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { ToolExecutor } from '../ToolExecutor.js';
import type { Tool, ToolInput } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { BrowserServiceFactory } from '@/modules/browser/index.js';
import { RegisterTool } from '../decorators.js';

const inputSchema = {
    url: zod.string().describe("URL to navigate to."),
};

@RegisterTool()
@injectable()
export default class CreateSessionTool implements Tool<typeof inputSchema> {
    readonly name = "create-session";
    readonly description = "Open a browser and navigate to a page with the given URL.";
    readonly inputSchema = inputSchema;

    constructor(
        @inject(dependencies.ToolExecutor) private readonly toolExecutor: ToolExecutor,
        @inject(dependencies.BrowserServiceFactory) private readonly browserServiceFactory: BrowserServiceFactory,
    ) {}

    async execute(args: ToolInput<typeof inputSchema>): Promise<CallToolResult> {
        return this.toolExecutor.execute(async (protocolRecordBuilder, toolResultBuilder) => {
            const browserService = this.browserServiceFactory.create(protocolRecordBuilder);
            const response = await browserService.createSession(args.url);
            const screenshot = await browserService.captureScreenshot(response.payload.id);
            return toolResultBuilder
                .setText(JSON.stringify(response, null, 4))
                .setScreenshot(screenshot)
                .build();
        });
    }
}
