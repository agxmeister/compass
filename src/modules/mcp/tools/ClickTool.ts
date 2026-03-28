import { injectable } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { Tool, ToolInput, BrowserToolContext } from '../types.js';
import type { BrowserToolOutput } from '../BrowserToolOutput.js';
import { RegisterTool } from '../decorators.js';

const inputSchema = {
    sessionId: zod.string().describe("Identifier of a browser session."),
    x: zod.number().describe("X coordinate to click."),
    y: zod.number().describe("Y coordinate to click."),
};

@RegisterTool(dependencies.BrowserTools)
@injectable()
export default class ClickTool implements Tool<typeof inputSchema, BrowserToolContext, BrowserToolOutput> {
    readonly name = "click";
    readonly description = "Click at the given coordinates on a browser page.";
    readonly inputSchema = inputSchema;

    async handle(args: ToolInput<typeof inputSchema>, { browserService, toolOutputBuilder }: BrowserToolContext): Promise<BrowserToolOutput> {
        return toolOutputBuilder
            .setData(
                await browserService.performAction(args.sessionId, {
                    type: "click" as const,
                    x: args.x,
                    y: args.y
                }))
            .setScreenshot(await browserService.captureScreenshot(args.sessionId))
            .build();
    }
}
