import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { ToolService } from '../ToolService.js';
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

    constructor(
        @inject(dependencies.ToolService) private readonly toolService: ToolService,
    ) {}

    async execute(args: { sessionId: string }): Promise<CallToolResult> {
        return this.toolService.deleteSession(
            args.sessionId,
            (result) => `Session ${result.payload.id} deleted successfully`,
        );
    }
}
