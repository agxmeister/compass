import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type {
    SessionServiceInterface,
    ActionServiceInterface,
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
        @inject(dependencies.SessionService) private readonly sessionService: SessionServiceInterface,
        @inject(dependencies.ActionService) private readonly actionService: ActionServiceInterface,
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
        const result = await this.sessionService.createSession(url, options?.includeScreenshot);
        recordBuilder.addResponse(result.payload as unknown as Record<string, unknown>);

        const text = formatResult(result.payload);

        return this.buildResult(text, recordBuilder, result.screenshot);
    }

    async deleteSession(
        sessionId: string,
        formatResult: (result: DeleteSessionResponse) => string,
    ): Promise<CallToolResult> {
        const recordBuilder = this.recordBuilderFactory.create();

        recordBuilder.addRequest(
            { path: "/api/sessions/{{sessionId}}", parameters: { sessionId } },
        );
        const result = await this.sessionService.deleteSession(sessionId);
        recordBuilder.addResponse(result.payload as unknown as Record<string, unknown>);

        const text = formatResult(result.payload);

        return this.buildResult(text, recordBuilder, result.screenshot);
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
        const result = await this.actionService.performAction(sessionId, action, options?.includeScreenshot);
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
