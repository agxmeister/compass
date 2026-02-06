import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { ToolExecutor } from '../ToolExecutor.js';
import type { ToolResultBuilderFactory } from '@/modules/mcp/index.js';
import type { Tool } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { BrowserServiceFactory } from '@/modules/browser/index.js';
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
        @inject(dependencies.ToolResultBuilderFactory) private readonly toolResultBuilderFactory: ToolResultBuilderFactory,
        @inject(dependencies.BrowserServiceFactory) private readonly browserServiceFactory: BrowserServiceFactory,
    ) {}

    async execute(args: { sessionId: string }): Promise<CallToolResult> {
        return this.toolExecutor.execute(async (protocolRecordBuilder) => {
            const browserService = this.browserServiceFactory.create(protocolRecordBuilder);
            const response = await browserService.deleteSession(args.sessionId);
            return this.toolResultBuilderFactory.create(protocolRecordBuilder)
                .setResponse(response as unknown as Record<string, unknown>)
                .setText(JSON.stringify(response, null, 4))
                .build();
        });
    }
}
