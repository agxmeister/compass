import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { ToolExecutor } from '../ToolExecutor.js';
import type { Tool } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { BrowserSessionServiceInterface, CreateSessionResponse } from '@/modules/browser/index.js';
import { RegisterTool } from '../decorators.js';

@RegisterTool()
@injectable()
export default class CreateSessionTool implements Tool {
    readonly name = "create_session";
    readonly description = "Create a new browser session and navigate to a URL";
    readonly inputSchema = {
        url: zod.string().describe("The URL to navigate to"),
    };

    constructor(
        @inject(dependencies.ToolExecutor) private readonly toolExecutor: ToolExecutor,
        @inject(dependencies.BrowserSessionService) private readonly browserSessionService: BrowserSessionServiceInterface,
    ) {}

    async execute(args: { url: string }): Promise<CallToolResult> {
        return this.toolExecutor.execute<CreateSessionResponse>(
            (requestRecorder) => this.browserSessionService.createSession(args.url, true, requestRecorder),
            (result) => `Session created successfully!\nSession ID: ${result.payload.id}\nCreated: ${result.payload.createDate}`,
        );
    }
}
