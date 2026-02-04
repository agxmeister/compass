import type { BrowserService, BrowserActionServiceInterface, Action, PerformActionResponse, Result } from './types.js';

export class BrowserActionService implements BrowserActionServiceInterface {
    constructor(
        private readonly browserService: BrowserService,
    ) {}

    async performAction(sessionId: string, action: Action, captureScreenshot: boolean): Promise<Result<PerformActionResponse>> {
        const payload = await this.browserService.performAction(sessionId, action);
        const screenshot = captureScreenshot
            ? await this.browserService.captureScreenshot(sessionId)
            : null;
        return { payload, screenshot };
    }
}
