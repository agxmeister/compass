import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { CallToolResultBuilderFactory } from './CallToolResultBuilderFactory.js';

export class ToolResultBuilder {
    private readonly callToolResultBuilder: ReturnType<CallToolResultBuilderFactory['create']>;

    constructor(
        private readonly callToolResultBuilderFactory: CallToolResultBuilderFactory,
    ) {
        this.callToolResultBuilder = this.callToolResultBuilderFactory.create();
    }

    setText(text: string): this {
        this.callToolResultBuilder.addText(text);
        return this;
    }

    setScreenshot(screenshot: string): this {
        this.callToolResultBuilder.addScreenshot(screenshot);
        return this;
    }

    build(): CallToolResult {
        return this.callToolResultBuilder.build();
    }
}
