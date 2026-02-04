import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { BrowserServiceFactory, BrowserSessionServiceInterface, BrowserSessionServiceFactory as BrowserSessionServiceFactoryInterface, RequestRecorder } from './types.js';
import { BrowserSessionService } from './BrowserSessionService.js';

@injectable()
export class BrowserSessionServiceFactory implements BrowserSessionServiceFactoryInterface {
    constructor(
        @inject(dependencies.BrowserServiceFactory) private readonly browserServiceFactory: BrowserServiceFactory,
    ) {}

    create(requestRecorder: RequestRecorder): BrowserSessionServiceInterface {
        const browserService = this.browserServiceFactory.create(requestRecorder);
        return new BrowserSessionService(browserService);
    }
}
