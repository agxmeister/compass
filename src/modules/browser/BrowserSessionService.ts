import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { BrowserService, BrowserSessionServiceInterface, CreateSessionResponse, DeleteSessionResponse, Result, RequestRecorder } from './types.js';

@injectable()
export class BrowserSessionService implements BrowserSessionServiceInterface {
    constructor(
        @inject(dependencies.BrowserService) private readonly browserService: BrowserService,
    ) {}

    async createSession(url: string, captureScreenshot: boolean, requestRecorder: RequestRecorder): Promise<Result<CreateSessionResponse>> {
        const payload = await this.browserService.createSession(url, requestRecorder);
        const screenshot = captureScreenshot
            ? await this.browserService.captureScreenshot(payload.payload.id)
            : null;
        return { payload, screenshot };
    }

    async deleteSession(sessionId: string, requestRecorder: RequestRecorder): Promise<Result<DeleteSessionResponse>> {
        const payload = await this.browserService.deleteSession(sessionId, requestRecorder);
        return { payload, screenshot: null };
    }
}
