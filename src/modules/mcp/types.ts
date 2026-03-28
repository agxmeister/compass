import { z as zod } from "zod";
import type { BrowserService } from '@/modules/browser/index.js';
import type { BrowserToolOutputBuilder } from './BrowserToolOutputBuilder.js';

export type ToolInput<Schema extends Record<string, zod.ZodTypeAny>> = zod.infer<zod.ZodObject<Schema>>;

export interface Tool<
    Schema extends Record<string, zod.ZodTypeAny> = Record<string, zod.ZodTypeAny>,
    Context = unknown,
    Output extends ToolOutput = ToolOutput,
> {
    readonly name: string;
    readonly description: string;
    readonly inputSchema: Schema;
    handle(args: ToolInput<Schema>, context: Context): Promise<Output>;
}

export interface ToolService<Context = unknown, Output extends ToolOutput = ToolOutput> {
    execute(handler: (context: Context) => Promise<Output>): Promise<Output>;
}

export interface ToolGroup<Context = unknown, Output extends ToolOutput = ToolOutput> {
    readonly tools: Tool<Record<string, zod.ZodTypeAny>, Context, Output>[];
    readonly toolService: ToolService<Context, Output>;
}

export interface ToolOutput {
    getTexts(): string[];
    getImages(): string[];
}

export interface ToolOutputBuilder<Output extends ToolOutput> {
    build(): Output;
}

export interface BrowserToolContext {
    browserService: BrowserService<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, unknown>;
    toolOutputBuilder: BrowserToolOutputBuilder;
}
