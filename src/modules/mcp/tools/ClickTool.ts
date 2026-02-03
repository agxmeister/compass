import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { ToolExecutor } from '../ToolExecutor.js';
import type { Tool } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { BrowserActionServiceInterface, PerformActionResponse } from '@/modules/browser/index.js';
import { RegisterTool } from '../decorators.js';

@RegisterTool()
@injectable()
export default class ClickTool implements Tool {
    readonly name = "click";
    readonly description = "Click at specific coordinates in a browser session";
    readonly inputSchema = {
        sessionId: zod.string().describe("The ID of the session"),
        x: zod.number().describe("X coordinate"),
        y: zod.number().describe("Y coordinate"),
    };

    constructor(
        @inject(dependencies.ToolExecutor) private readonly toolExecutor: ToolExecutor,
        @inject(dependencies.BrowserActionService) private readonly browserActionService: BrowserActionServiceInterface,
    ) {}

    async execute(args: { sessionId: string; x: number; y: number }): Promise<CallToolResult> {
        const action = { type: "click" as const, x: args.x, y: args.y };
        return this.toolExecutor.execute<PerformActionResponse>(
            (requestRecorder) => this.browserActionService.performAction(args.sessionId, action, true, requestRecorder),
            (result) => `${result.message}\nAction: ${JSON.stringify(result.payload, null, 4)}`,
        );
    }
}
