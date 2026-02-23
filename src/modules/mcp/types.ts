import { z as zod } from "zod";
import type { BrowserService } from '@/modules/browser/index.js';
import type { ToolResultBuilder } from './ToolResultBuilder.js';

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

export interface ToolService<Context> {
    execute(handler: (context: Context) => Promise<ToolOutput>): Promise<ToolOutput>;
}

export interface BrowserToolContext {
    browserService: BrowserService;
    toolResultBuilder: ToolResultBuilder;
}
