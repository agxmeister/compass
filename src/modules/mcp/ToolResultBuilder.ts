import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export class ToolResultBuilder {
    private text?: string;
    private screenshot?: string;

    setText(text: string): this {
        this.text = text;
        return this;
    }

    setScreenshot(screenshot: string): this {
        this.screenshot = screenshot;
        return this;
    }

    build(): CallToolResult {
        if (!this.text) {
            throw new Error("Cannot build CallToolResult without text");
        }

        const content: CallToolResult['content'] = [
            {
                type: "text",
                text: this.text,
            },
        ];

        if (this.screenshot) {
            content.push({
                type: "image",
                data: this.screenshot,
                mimeType: "image/png",
            });
        }

        return { content };
    }
}
