import { z as zod } from "zod";
import type { BrowserService } from '@/modules/browser/index.js';
import type { ToolResultBuilder } from './ToolResultBuilder.js';

export type ToolInput<Schema extends Record<string, zod.ZodTypeAny>> = zod.infer<zod.ZodObject<Schema>>;

export interface Tool<
    Schema extends Record<string, zod.ZodTypeAny> = Record<string, zod.ZodTypeAny>,
    Output = unknown
> {
    readonly name: string;
    readonly description: string;
    readonly inputSchema: Schema;
    execute(args: ToolInput<Schema>): Promise<Output>;
}

export interface ToolService<Context, Output = unknown> {
    execute(handler: (context: Context) => Promise<Output>): Promise<Output>;
}

export type BrowserToolOutput = {
    data: Record<string, unknown>;
    screenshot?: string;
};

export interface BrowserToolContext {
    browserService: BrowserService<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, unknown>;
    toolResultBuilder: ToolResultBuilder;
}
