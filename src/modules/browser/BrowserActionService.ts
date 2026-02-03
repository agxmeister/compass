import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { BrowserService, BrowserActionServiceInterface, Action, PerformActionResponse, Result, RequestRecorder } from './types.js';

@injectable()
export class BrowserActionService implements BrowserActionServiceInterface {
    constructor(
        @inject(dependencies.BrowserService) private readonly browserService: BrowserService,
    ) {}

    async performAction(sessionId: string, action: Action, captureScreenshot: boolean, requestRecorder: RequestRecorder): Promise<Result<PerformActionResponse>> {
        const payload = await this.browserService.performAction(sessionId, action, requestRecorder);
        const screenshot = captureScreenshot
            ? await this.browserService.captureScreenshot(sessionId)
            : null;
        return { payload, screenshot };
    }
}
