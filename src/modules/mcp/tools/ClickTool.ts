import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { ToolExecutor } from '../ToolExecutor.js';
import type { ToolResultBuilderFactory } from '@/modules/mcp/index.js';
import type { Tool, ToolInput } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { BrowserServiceFactory } from '@/modules/browser/index.js';
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
        @inject(dependencies.ToolResultBuilderFactory) private readonly toolResultBuilderFactory: ToolResultBuilderFactory,
        @inject(dependencies.BrowserServiceFactory) private readonly browserServiceFactory: BrowserServiceFactory,
    ) {}

    async execute(args: ToolInput<typeof inputSchema>): Promise<CallToolResult> {
        return this.toolExecutor.execute(async (protocolRecordBuilder) => {
            const browserService = this.browserServiceFactory.create(protocolRecordBuilder);
            const response = await browserService.performAction(args.sessionId, {
                type: "click" as const,
                x: args.x,
                y: args.y
            });
            const screenshot = await browserService.captureScreenshot(args.sessionId);
            return this.toolResultBuilderFactory.create()
                .setText(JSON.stringify(response, null, 4))
                .setScreenshot(screenshot)
                .build();
        });
    }
}
