import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { AxisService } from '@/modules/axis/index.js';
import type { Tool } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { RegisterTool } from '../decorators.js';

@RegisterTool()
@injectable()
export default class DeleteSessionTool implements Tool {
    readonly name = "delete_session";
    readonly description = "Delete an existing browser session";
    readonly inputSchema = {
        sessionId: zod.string().describe("The ID of the session to delete"),
    };

    constructor(@inject(dependencies.AxisService) private readonly axisService: AxisService) {}

    async execute(args: { sessionId: string }): Promise<CallToolResult> {
        const result = await this.axisService.deleteSession(args.sessionId);
        return {
            content: [
                {
                    type: "text",
                    text: `Session ${result.payload.id} deleted successfully`,
                },
            ],
        };
    }
}
