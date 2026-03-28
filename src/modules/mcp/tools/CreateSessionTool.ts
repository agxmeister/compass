import { injectable } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { Tool, ToolInput, BrowserToolContext } from '../types.js';
import type { BrowserToolOutput } from '../BrowserToolOutput.js';
import { RegisterTool } from '../decorators.js';

const inputSchema = {
    url: zod.string().describe("URL to navigate to."),
};

@RegisterTool(dependencies.BrowserTools)
@injectable()
export default class CreateSessionTool implements Tool<typeof inputSchema, BrowserToolContext, BrowserToolOutput> {
    readonly name = "create-session";
    readonly description = "Open a browser and navigate to a page with the given URL.";
    readonly inputSchema = inputSchema;

    async handle(args: ToolInput<typeof inputSchema>, { browserService, toolOutputBuilder }: BrowserToolContext): Promise<BrowserToolOutput> {
        const result = await browserService.createSession(args.url);
        return toolOutputBuilder
            .setData(result)
            .setScreenshot(await browserService.captureScreenshot(result.sessionId))
            .build();
    }
}
