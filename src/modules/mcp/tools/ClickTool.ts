import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { ToolExecutor } from '../ToolExecutor.js';
import type { Tool, ToolInput, ToolOutput } from '../types.js';
import { RegisterTool } from '../decorators.js';

const inputSchema = {
    sessionId: zod.string().describe("Identifier of a browser session."),
    x: zod.number().describe("X coordinate to click."),
    y: zod.number().describe("Y coordinate to click."),
};

@RegisterTool()
@injectable()
export default class ClickTool implements Tool<typeof inputSchema> {
    readonly name = "click";
    readonly description = "Click at the given coordinates on a browser page.";
    readonly inputSchema = inputSchema;

    constructor(
        @inject(dependencies.ToolExecutor) private readonly toolExecutor: ToolExecutor,
    ) {}

    async execute(args: ToolInput<typeof inputSchema>): Promise<ToolOutput> {
        return this.toolExecutor.execute(
            async (browserService, toolResultBuilder) =>
                toolResultBuilder
                    .setData(
                        await browserService.performAction(args.sessionId, {
                            type: "click" as const,
                            x: args.x,
                            y: args.y
                        }))
                    .setScreenshot(await browserService.captureScreenshot(args.sessionId))
                    .build()
        );
    }
}
