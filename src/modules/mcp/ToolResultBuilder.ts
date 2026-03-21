import { BrowserToolOutput } from "./BrowserToolOutput.js";

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

    build(): BrowserToolOutput {
        if (this.data === undefined) {
            throw new Error("Cannot build ToolOutput without data");
        }

        return new BrowserToolOutput(this.data, this.screenshot);
    }
}
