import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { ToolExecutor } from '../ToolExecutor.js';
import type { Tool } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { BrowserSessionServiceInterface, DeleteSessionResponse } from '@/modules/browser/index.js';
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
        @inject(dependencies.ToolExecutor) private readonly toolExecutor: ToolExecutor,
        @inject(dependencies.BrowserSessionService) private readonly browserSessionService: BrowserSessionServiceInterface,
    ) {}

    async execute(args: { sessionId: string }): Promise<CallToolResult> {
        return this.toolExecutor.execute<DeleteSessionResponse>(
            (requestRecorder) => this.browserSessionService.deleteSession(args.sessionId, requestRecorder),
            (result) => `Session ${result.payload.id} deleted successfully`,
        );
    }
}
