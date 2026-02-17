import type { ToolOutput } from "./types.js";

export class ToolResultBuilder {
    private data?: Record<string, unknown>;
    private screenshot?: string;

    setData(data: Record<string, unknown>): this {
        this.data = data;
        return this;
    }

    setScreenshot(screenshot: string): this {
        this.screenshot = screenshot;
        return this;
    }

    build(): ToolOutput {
        if (!this.data) {
            throw new Error("Cannot build ToolOutput without data");
        }

        return {
            data: this.data,
            ...(this.screenshot && { screenshot: this.screenshot }),
        };
    }
}
