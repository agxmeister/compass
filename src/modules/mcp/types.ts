import { z as zod } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export interface Tool {
    readonly name: string;
    readonly description: string;
    readonly inputSchema: Record<string, zod.ZodTypeAny>;
    execute(args: any): Promise<CallToolResult>;
}

export type ResultOptions = {
    sessionId?: string;
    includeScreenshot?: boolean;
};
