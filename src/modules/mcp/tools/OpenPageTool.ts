import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { AxisService } from '@/modules/axis/index.js';
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

    constructor(@inject(dependencies.AxisService) private readonly axisService: AxisService) {}

    async execute(args: { sessionId: string; url: string }): Promise<CallToolResult> {
        const result = await this.axisService.performAction(args.sessionId, {
            type: "open-page",
            url: args.url,
        });

        const content: any[] = [
            {
                type: "text",
                text: `${result.message}\nAction: ${JSON.stringify(result.payload, null, 2)}`,
            },
        ];

        const screenshot = await this.axisService.captureScreenshot(args.sessionId);
        if (screenshot) {
            content.push({
                type: "image",
                data: screenshot,
                mimeType: "image/png",
            });
        }

        return { content };
    }
}
