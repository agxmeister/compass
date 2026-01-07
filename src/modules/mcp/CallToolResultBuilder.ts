import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { AxisService } from '@/modules/axis/index.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

@injectable()
export class CallToolResultBuilder {
    constructor(@inject(dependencies.AxisService) private readonly axisService: AxisService) {}

    /**
     * Build a CallToolResult with text content and optionally a screenshot
     *
     * @param text - The text content to return
     * @param options - Optional configuration
     * @param options.sessionId - Session ID for screenshot capture
     * @param options.includeScreenshot - Whether to capture and include a screenshot
     * @returns Promise resolving to CallToolResult
     */
    async build(
        text: string,
        options?: { sessionId?: string; includeScreenshot?: boolean }
    ): Promise<CallToolResult> {
        const content: CallToolResult['content'] = [
            {
                type: "text",
                text,
            },
        ];

        if (options?.sessionId && options?.includeScreenshot) {
            const screenshot = await this.axisService.captureScreenshot(options.sessionId);
            if (screenshot) {
                content.push({
                    type: "image",
                    data: screenshot,
                    mimeType: "image/png",
                });
            }
        }

        return { content };
    }
}
