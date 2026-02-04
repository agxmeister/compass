import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { ToolExecutor } from '../ToolExecutor.js';
import type { ToolResultBuilderFactory } from '../ToolResultBuilderFactory.js';
import type { Tool } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { BrowserActionServiceFactoryInterface } from '@/modules/browser/index.js';
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
        @inject(dependencies.BrowserActionServiceFactory) private readonly browserActionServiceFactory: BrowserActionServiceFactoryInterface,
    ) {}

    async execute(args: { sessionId: string; url: string }): Promise<CallToolResult> {
        const action = { type: "open-page" as const, url: args.url };
        return this.toolExecutor.execute(async (protocolRecordBuilder) => {
            const result = await this.browserActionServiceFactory.create(protocolRecordBuilder)
                .performAction(args.sessionId, action, true);
            return this.toolResultBuilderFactory.create(protocolRecordBuilder)
                .setResponse(result.payload as unknown as Record<string, unknown>)
                .setText(`${result.payload.message}\nPage: ${JSON.stringify(result.payload.payload, null, 4)}`)
                .setScreenshot(result.screenshot)
                .build();
        });
    }
}
