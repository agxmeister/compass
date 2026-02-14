import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { ToolExecutor } from '../ToolExecutor.js';
import type { Tool, ToolInput } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { RegisterTool } from '../decorators.js';

const inputSchema = {
    sessionId: zod.string().describe("Identifier of a browser session."),
    url: zod.string().describe("URL to navigate to."),
};

@RegisterTool()
@injectable()
export default class NavigateTool implements Tool<typeof inputSchema> {
    readonly name = "navigate";
    readonly description = "Navigate to a page with the given URL in a browser.";
    readonly inputSchema = inputSchema;

    constructor(
        @inject(dependencies.ToolExecutor) private readonly toolExecutor: ToolExecutor,
    ) {}

    async execute(args: ToolInput<typeof inputSchema>): Promise<CallToolResult> {
        return this.toolExecutor.execute(
            async (browserService, toolResultBuilder) =>
                toolResultBuilder
                    .setText(JSON.stringify(
                        await browserService.performAction(args.sessionId, {
                            type: "navigate" as const,
                            url: args.url
                        }), null, 4))
                    .setScreenshot(await browserService.captureScreenshot(args.sessionId))
                    .build()
        );
    }
}
