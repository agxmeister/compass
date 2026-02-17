import { z as zod } from "zod";

export type ToolInput<Schema extends Record<string, zod.ZodTypeAny>> = zod.infer<zod.ZodObject<Schema>>;

export interface ToolOutput {
    data: Record<string, unknown>;
    screenshot?: string;
}

export interface Tool<Schema extends Record<string, zod.ZodTypeAny> = Record<string, zod.ZodTypeAny>> {
    readonly name: string;
    readonly description: string;
    readonly inputSchema: Schema;
    execute(args: ToolInput<Schema>): Promise<ToolOutput>;
}
