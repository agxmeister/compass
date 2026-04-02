import { injectable } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { Tool, ToolInput, BrowserToolContext } from '../types.js';
import type { BrowserToolOutput } from '../BrowserToolOutput.js';
import { RegisterTool } from '../decorators.js';

const inputSchema = {
    sessionId: zod.string().describe("Identifier of a browser session."),
    text: zod.string().describe("Text to type."),
};

@RegisterTool(dependencies.BrowserTools)
@injectable()
export default class TypeTool implements Tool<typeof inputSchema, BrowserToolContext, BrowserToolOutput> {
    readonly name = "type";
    readonly description = "Type text on a browser page.";
    readonly inputSchema = inputSchema;

    async handle(args: ToolInput<typeof inputSchema>, { browserService, toolOutputBuilder }: BrowserToolContext): Promise<BrowserToolOutput> {
        return toolOutputBuilder
            .setData(
                await browserService.performAction(args.sessionId, {
                    type: "type" as const,
                    text: args.text,
                }))
            .setScreenshot(await browserService.captureScreenshot(args.sessionId))
            .build();
    }
}
