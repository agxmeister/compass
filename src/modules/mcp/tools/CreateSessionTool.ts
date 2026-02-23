import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { Tool, ToolInput, ToolOutput, ToolService, BrowserToolContext } from '../types.js';
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
        @inject(dependencies.ToolService) private readonly toolService: ToolService<BrowserToolContext>,
    ) {}

    async execute(args: ToolInput<typeof inputSchema>): Promise<ToolOutput> {
        return this.toolService.execute(
            async ({ browserService, toolResultBuilder }) => {
                const response = await browserService.createSession(args.url);
                return toolResultBuilder
                    .setData(response)
                    .setScreenshot((await browserService.captureScreenshot(response.payload.id)).body)
                    .build();
            }
        );
    }
}
