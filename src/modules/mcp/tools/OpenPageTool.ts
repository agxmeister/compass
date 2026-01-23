import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { BrowserService } from '@/modules/browser/index.js';
import type { Tool } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
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
        @inject(dependencies.BrowserService) private readonly browserService: BrowserService,
    ) {}

    async execute(args: { sessionId: string; url: string }): Promise<CallToolResult> {
        return this.browserService.performAction(
            args.sessionId,
            {
                type: "open-page",
                url: args.url,
            },
            (result) => `${result.message}\nAction: ${JSON.stringify(result.payload, null, 4)}`,
            { includeScreenshot: true },
        );
    }
}
