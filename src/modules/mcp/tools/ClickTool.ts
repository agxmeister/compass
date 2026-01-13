import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { AxisService } from '@/modules/axis/index.js';
import type { Tool } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { CallToolResultBuilder } from '@/modules/mcp/index.js';
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
        @inject(dependencies.AxisService) private readonly axisService: AxisService,
        @inject(dependencies.CallToolResultBuilder) private readonly resultBuilder: CallToolResultBuilder
    ) {}

    async execute(args: { sessionId: string; x: number; y: number }): Promise<CallToolResult> {
        const result = await this.axisService.performAction(args.sessionId, {
            type: "click",
            x: args.x,
            y: args.y,
        });

        return this.resultBuilder.build(
            `${result.message}\nAction: ${JSON.stringify(result.payload, null, 4)}`,
            { sessionId: args.sessionId, includeScreenshot: true }
        );
    }
}
