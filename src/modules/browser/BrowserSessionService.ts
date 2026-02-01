import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { BrowserService, BrowserSessionServiceInterface, CreateSessionResponse, DeleteSessionResponse, Result } from './types.js';

@injectable()
export class BrowserSessionService implements BrowserSessionServiceInterface {
    constructor(
        @inject(dependencies.BrowserService) private readonly browserService: BrowserService,
    ) {}

    async createSession(url: string, captureScreenshot = false): Promise<Result<CreateSessionResponse>> {
        const payload = await this.browserService.createSession(url);
        const screenshot = captureScreenshot
            ? await this.browserService.captureScreenshot(payload.payload.id)
            : null;
        return { payload, screenshot };
    }

    async deleteSession(sessionId: string): Promise<Result<DeleteSessionResponse>> {
        const payload = await this.browserService.deleteSession(sessionId);
        return { payload, screenshot: null };
    }
}
