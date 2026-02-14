import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { ToolExecutor } from '../ToolExecutor.js';
import type { Tool, ToolInput } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { BrowserServiceFactory } from '@/modules/browser/index.js';
import { RegisterTool } from '../decorators.js';

const inputSchema = {
    sessionId: zod.string().describe("Identifier of a browser session."),
};

@RegisterTool()
@injectable()
export default class DeleteSessionTool implements Tool<typeof inputSchema> {
    readonly name = "delete-session";
    readonly description = "Close a browser.";
    readonly inputSchema = inputSchema;

    constructor(
        @inject(dependencies.ToolExecutor) private readonly toolExecutor: ToolExecutor,
        @inject(dependencies.BrowserServiceFactory) private readonly browserServiceFactory: BrowserServiceFactory,
    ) {}

    async execute(args: ToolInput<typeof inputSchema>): Promise<CallToolResult> {
        return this.toolExecutor.execute(async (protocolRecordBuilder, toolResultBuilder) => {
            const browserService = this.browserServiceFactory.create(protocolRecordBuilder);
            const response = await browserService.deleteSession(args.sessionId);
            return toolResultBuilder
                .setText(JSON.stringify(response, null, 4))
                .build();
        });
    }
}
