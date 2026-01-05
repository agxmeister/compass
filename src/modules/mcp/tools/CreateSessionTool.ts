import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { AxisService } from '@/modules/axis/index.js';
import type { Tool } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { RegisterTool } from '../decorators.js';

const createSessionSchema = {
    url: zod.string().describe("The URL to navigate to"),
};

@RegisterTool()
@injectable()
export default class CreateSessionTool implements Tool {
    readonly name = "create_session";
    readonly description = "Create a new browser session and navigate to a URL";
    readonly inputSchema = createSessionSchema;

    constructor(@inject(dependencies.AxisService) private readonly axisService: AxisService) {}

    async execute(args: { url: string }): Promise<CallToolResult> {
        const result = await this.axisService.createSession(args.url);

        const content: any[] = [
            {
                type: "text",
                text: `Session created successfully!\nSession ID: ${result.payload.id}\nCreated: ${result.payload.createDate}`,
            },
        ];

        const screenshot = await this.axisService.captureScreenshot(result.payload.id);
        if (screenshot) {
            content.push({
                type: "image",
                data: screenshot,
                mimeType: "image/png",
            });
        }

        return { content };
    }
}
