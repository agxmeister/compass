import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { Result } from '@/modules/browser/index.js';
import type { ProtocolServiceInterface, ScreenshotServiceInterface } from '@/modules/protocol/index.js';
import { ProtocolRecordBuilderFactory } from '@/modules/protocol/index.js';
import { CallToolResultBuilderFactory } from './CallToolResultBuilderFactory.js';
import type { ExecuteRequest } from './types.js';

@injectable()
export class ToolExecutor {
    constructor(
        @inject(dependencies.ProtocolRecordBuilderFactory) private readonly recordBuilderFactory: ProtocolRecordBuilderFactory,
        @inject(dependencies.CallToolResultBuilderFactory) private readonly resultBuilderFactory: CallToolResultBuilderFactory,
        @inject(dependencies.ScreenshotService) private readonly screenshotService: ScreenshotServiceInterface,
        @inject(dependencies.ProtocolService) private readonly protocolService: ProtocolServiceInterface,
    ) {}

    async execute<T>(
        operation: () => Promise<Result<T>>,
        request: ExecuteRequest,
        formatResult: (result: T) => string,
    ): Promise<CallToolResult> {
        const recordBuilder = this.recordBuilderFactory.create();

        recordBuilder.addRequest(request.endpoint, request.body);
        const result = await operation();
        recordBuilder.addResponse(result.payload as unknown as Record<string, unknown>);

        const text = formatResult(result.payload);

        return this.buildResult(text, recordBuilder, result.screenshot);
    }

    private async buildResult(
        text: string,
        recordBuilder: ReturnType<ProtocolRecordBuilderFactory['create']>,
        screenshot: string | null,
    ): Promise<CallToolResult> {
        const resultBuilder = this.resultBuilderFactory.create();
        resultBuilder.addText(text);

        if (screenshot) {
            resultBuilder.addScreenshot(screenshot);

            const screenshotPath = await this.screenshotService.saveScreenshot(screenshot);
            recordBuilder.addScreenshot(screenshotPath);
        }

        const record = recordBuilder.build();
        await this.protocolService.addRecord(record);

        return resultBuilder.build();
    }
}
