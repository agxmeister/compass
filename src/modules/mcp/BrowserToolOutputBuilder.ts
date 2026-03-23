import { BrowserToolOutput } from "./BrowserToolOutput.js";
import type { ToolOutputBuilder } from "./types.js";

export class BrowserToolOutputBuilder implements ToolOutputBuilder<BrowserToolOutput> {
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

    build(): BrowserToolOutput {
        if (this.data === undefined) {
            throw new Error("Cannot build ToolOutput without data");
        }

        return new BrowserToolOutput(this.data, this.screenshot);
    }
}
