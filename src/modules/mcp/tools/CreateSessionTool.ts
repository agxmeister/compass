import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { ToolExecutor } from '../ToolExecutor.js';
import type { Tool, ToolInput } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { RegisterTool } from '../decorators.js';

const inputSchema = {
    url: zod.string().describe("URL to navigate to."),
};

@RegisterTool()
@injectable()
export default class CreateSessionTool implements Tool<typeof inputSchema> {
    readonly name = "create-session";
    readonly description = "Open a browser and navigate to a page with the given URL.";
    readonly inputSchema = inputSchema;

    constructor(
        @inject(dependencies.ToolExecutor) private readonly toolExecutor: ToolExecutor,
    ) {}

    async execute(args: ToolInput<typeof inputSchema>): Promise<CallToolResult> {
        return this.toolExecutor.execute(
            async (browserService, toolResultBuilder) => {
                const response = await browserService.createSession(args.url);
                return toolResultBuilder
                    .setText(JSON.stringify(response, null, 4))
                    .setScreenshot(await browserService.captureScreenshot(response.payload.id))
                    .build();
            }
        );
    }
}
