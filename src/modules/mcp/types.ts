import { z as zod } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export type ToolInput<Schema extends Record<string, zod.ZodTypeAny>> = zod.infer<zod.ZodObject<Schema>>;

export interface Tool<Schema extends Record<string, zod.ZodTypeAny> = Record<string, zod.ZodTypeAny>> {
    readonly name: string;
    readonly description: string;
    readonly inputSchema: Schema;
    execute(args: ToolInput<Schema>): Promise<CallToolResult>;
}
