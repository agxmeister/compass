import { injectable } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { Tool, ToolInput, BrowserToolContext } from '../types.js';
import type { BrowserToolOutput } from '../BrowserToolOutput.js';
import { RegisterTool } from '../decorators.js';

const inputSchema = {
    sessionId: zod.string().describe("Identifier of a browser session."),
    url: zod.string().describe("URL to navigate to."),
};

@RegisterTool(dependencies.BrowserTools)
@injectable()
export default class NavigateTool implements Tool<typeof inputSchema, BrowserToolContext, BrowserToolOutput> {
    readonly name = "navigate";
    readonly description = "Navigate to a page with the given URL in a browser.";
    readonly inputSchema = inputSchema;

    async handle(args: ToolInput<typeof inputSchema>, { browserService, toolOutputBuilder }: BrowserToolContext): Promise<BrowserToolOutput> {
        return toolOutputBuilder
            .setData(
                await browserService.performAction(args.sessionId, {
                    type: "navigate" as const,
                    url: args.url
                }))
            .setScreenshot(await browserService.captureScreenshot(args.sessionId))
            .build();
    }
}
