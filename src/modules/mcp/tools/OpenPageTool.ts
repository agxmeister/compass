import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { ToolExecutor } from '../ToolExecutor.js';
import type { Tool } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { BrowserActionServiceInterface, PerformActionResponse } from '@/modules/browser/index.js';
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
        @inject(dependencies.BrowserActionService) private readonly browserActionService: BrowserActionServiceInterface,
    ) {}

    async execute(args: { sessionId: string; url: string }): Promise<CallToolResult> {
        const action = { type: "open-page" as const, url: args.url };
        return this.toolExecutor.execute<PerformActionResponse>(
            (requestRecorder) => this.browserActionService.performAction(args.sessionId, action, true, requestRecorder),
            (result) => `${result.message}\nAction: ${JSON.stringify(result.payload, null, 4)}`,
        );
    }
}
