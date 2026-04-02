import { injectable } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { Tool, ToolInput } from '../../types.js';
import type { BrowserToolContext } from '../types.js';
import type { BrowserToolOutput } from '../BrowserToolOutput.js';
import { RegisterTool } from '../../decorators.js';

const inputSchema = {
    sessionId: zod.string().describe("Identifier of a browser session."),
};

@RegisterTool(dependencies.BrowserTools)
@injectable()
export default class DeleteSessionTool implements Tool<typeof inputSchema, BrowserToolContext, BrowserToolOutput> {
    readonly name = "delete-session";
    readonly description = "Close a browser.";
    readonly inputSchema = inputSchema;

    async handle(args: ToolInput<typeof inputSchema>, { browserService, toolOutputBuilder }: BrowserToolContext): Promise<BrowserToolOutput> {
        return toolOutputBuilder
            .setData(
                await browserService.deleteSession(args.sessionId))
            .build();
    }
}
