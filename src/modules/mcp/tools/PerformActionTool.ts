import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { AxisService } from '@/modules/axis/index.js';
import type { Tool } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { RegisterTool } from '../decorators.js';

const performActionSchema = {
    sessionId: zod.string().describe("The ID of the session"),
    action: zod
        .discriminatedUnion("type", [
            zod.object({
                type: zod.literal("click"),
                x: zod.number().describe("X coordinate"),
                y: zod.number().describe("Y coordinate"),
            }),
            zod.object({
                type: zod.literal("open-page"),
                url: zod.string().describe("URL to navigate to"),
            }),
        ])
        .describe("The action to perform"),
};

@RegisterTool()
@injectable()
export default class PerformActionTool implements Tool {
    readonly name = "perform_action";
    readonly description = "Perform an action in a browser session (click or open-page)";
    readonly inputSchema = performActionSchema;

    constructor(@inject(dependencies.AxisService) private readonly axisService: AxisService) {}

    async execute(args: { sessionId: string; action: any }): Promise<CallToolResult> {
        const result = await this.axisService.performAction(args.sessionId, args.action);

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
