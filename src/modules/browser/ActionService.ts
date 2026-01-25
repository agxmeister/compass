import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { BrowserService, ActionServiceInterface, Action, PerformActionResponse, Result } from './types.js';

@injectable()
export class ActionService implements ActionServiceInterface {
    constructor(
        @inject(dependencies.BrowserService) private readonly browserService: BrowserService,
    ) {}

    async performAction(sessionId: string, action: Action, captureScreenshot = false): Promise<Result<PerformActionResponse>> {
        const payload = await this.browserService.performAction(sessionId, action);
        const screenshot = captureScreenshot
            ? await this.browserService.captureScreenshot(sessionId)
            : null;
        return { payload, screenshot };
    }
}
