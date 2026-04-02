import type { ToolOutput } from "../types.js";

export class BrowserToolOutput implements ToolOutput {
    constructor(
        private readonly data: Record<string, unknown>,
        private readonly screenshot?: string,
    ) {}

    getTexts(): string[] {
        return [JSON.stringify(this.data, null, 4)];
    }

    getImages(): string[] {
        return this.screenshot ? [this.screenshot] : [];
    }
}
