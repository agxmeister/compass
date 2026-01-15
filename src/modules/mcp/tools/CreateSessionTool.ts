import { injectable, inject } from 'inversify';
import { z as zod } from "zod";
import { dependencies } from '@/dependencies.js';
import type { AxisService } from '@/modules/axis/index.js';
import type { Tool } from '../types.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
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
        @inject(dependencies.AxisService) private readonly axisService: AxisService,
    ) {}

    async execute(args: { url: string }): Promise<CallToolResult> {
        return this.axisService.createSession(
            args.url,
            (result) => `Session created successfully!\nSession ID: ${result.payload.id}\nCreated: ${result.payload.createDate}`,
            { includeScreenshot: true },
        );
    }
}
