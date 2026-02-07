import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ScreenshotServiceInterface } from '@/modules/protocol/index.js';
import type { ProtocolRecordBuilder } from '@/modules/protocol/index.js';
import { CallToolResultBuilderFactory } from './CallToolResultBuilderFactory.js';

export class ToolResultBuilder {
    private readonly callToolResultBuilder: ReturnType<CallToolResultBuilderFactory['create']>;
    private screenshot: string | null = null;

    constructor(
        private readonly protocolRecordBuilder: ProtocolRecordBuilder,
        private readonly callToolResultBuilderFactory: CallToolResultBuilderFactory,
        private readonly screenshotService: ScreenshotServiceInterface,
    ) {
        this.callToolResultBuilder = this.callToolResultBuilderFactory.create();
    }

    setResponse(payload: Record<string, unknown>): this {
        this.protocolRecordBuilder.addResponse(payload);
        return this;
    }

    setText(text: string): this {
        this.callToolResultBuilder.addText(text);
        return this;
    }

    setScreenshot(screenshot: string): this {
        this.screenshot = screenshot;
        this.callToolResultBuilder.addScreenshot(screenshot);
        return this;
    }

    async build(): Promise<CallToolResult> {
        if (this.screenshot) {
            const screenshotPath = await this.screenshotService.saveScreenshot(this.screenshot);
            this.protocolRecordBuilder.addScreenshot(screenshotPath);
        }

        return this.callToolResultBuilder.build();
    }
}
