import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type {
    BrowserService,
    CreateSessionResponse,
    DeleteSessionResponse,
    PerformActionResponse,
    Action,
} from '@/modules/browser/index.js';
import type { ProtocolServiceInterface, ScreenshotServiceInterface } from '@/modules/protocol/index.js';
import { ProtocolRecordBuilderFactory } from '@/modules/protocol/index.js';
import { CallToolResultBuilderFactory } from './CallToolResultBuilderFactory.js';
import type { ResultOptions } from './types.js';

@injectable()
export class ToolService {
    constructor(
        @inject(dependencies.BrowserService) private readonly browserService: BrowserService,
        @inject(dependencies.ProtocolRecordBuilderFactory) private readonly recordBuilderFactory: ProtocolRecordBuilderFactory,
        @inject(dependencies.CallToolResultBuilderFactory) private readonly resultBuilderFactory: CallToolResultBuilderFactory,
        @inject(dependencies.ScreenshotService) private readonly screenshotService: ScreenshotServiceInterface,
        @inject(dependencies.ProtocolService) private readonly protocolService: ProtocolServiceInterface,
    ) {}

    async createSession(
        url: string,
        formatResult: (result: CreateSessionResponse) => string,
        options?: ResultOptions,
    ): Promise<CallToolResult> {
        const recordBuilder = this.recordBuilderFactory.create();

        recordBuilder.addRequest({ path: "/api/sessions" }, { url });
        const result = await this.browserService.createSession(url);
        recordBuilder.addResponse(result as unknown as Record<string, unknown>);

        const text = formatResult(result);

        return this.buildResult(text, recordBuilder, {
            sessionId: result.payload.id,
            includeScreenshot: options?.includeScreenshot,
        });
    }

    async deleteSession(
        sessionId: string,
        formatResult: (result: DeleteSessionResponse) => string,
    ): Promise<CallToolResult> {
        const recordBuilder = this.recordBuilderFactory.create();

        recordBuilder.addRequest(
            { path: "/api/sessions/{{sessionId}}", parameters: { sessionId } },
        );
        const result = await this.browserService.deleteSession(sessionId);
        recordBuilder.addResponse(result as unknown as Record<string, unknown>);

        const text = formatResult(result);

        return this.buildResult(text, recordBuilder);
    }

    async performAction(
        sessionId: string,
        action: Action,
        formatResult: (result: PerformActionResponse) => string,
        options?: ResultOptions,
    ): Promise<CallToolResult> {
        const recordBuilder = this.recordBuilderFactory.create();

        recordBuilder.addRequest(
            { path: "/api/sessions/{{sessionId}}/actions", parameters: { sessionId } },
            action as unknown as Record<string, unknown>,
        );
        const result = await this.browserService.performAction(sessionId, action);
        recordBuilder.addResponse(result as unknown as Record<string, unknown>);

        const text = formatResult(result);

        return this.buildResult(text, recordBuilder, {
            sessionId,
            includeScreenshot: options?.includeScreenshot,
        });
    }

    private async buildResult(
        text: string,
        recordBuilder: ReturnType<ProtocolRecordBuilderFactory['create']>,
        options?: ResultOptions,
    ): Promise<CallToolResult> {
        const resultBuilder = this.resultBuilderFactory.create();
        resultBuilder.addText(text);

        if (options?.sessionId && options?.includeScreenshot) {
            const screenshot = await this.browserService.captureScreenshot(options.sessionId);
            if (screenshot) {
                resultBuilder.addScreenshot(screenshot);

                const screenshotPath = await this.screenshotService.saveScreenshot(screenshot);
                recordBuilder.addScreenshot(screenshotPath);
            }
        }

        const record = recordBuilder.build();
        await this.protocolService.addRecord(record);

        return resultBuilder.build();
    }
}
