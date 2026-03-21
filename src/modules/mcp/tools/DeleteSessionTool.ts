import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { Tool, ToolInput, ToolService, BrowserToolContext } from '../types.js';
import type { BrowserToolOutput } from '../BrowserToolOutput.js';
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
        @inject(dependencies.ToolService) private readonly toolService: ToolService<BrowserToolContext, BrowserToolOutput>,
    ) {}

    async execute(args: ToolInput<typeof inputSchema>): Promise<BrowserToolOutput> {
        return this.toolService.execute(
            async ({ browserService, toolResultBuilder }) =>
                toolResultBuilder
                    .setData(
                        await browserService.deleteSession(args.sessionId))
                    .build()
        );
    }
}
