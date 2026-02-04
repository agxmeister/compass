import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { BrowserServiceFactory, BrowserActionServiceInterface, BrowserActionServiceFactory as BrowserActionServiceFactoryInterface, RequestRecorder } from './types.js';
import { BrowserActionService } from './BrowserActionService.js';

@injectable()
export class BrowserActionServiceFactory implements BrowserActionServiceFactoryInterface {
    constructor(
        @inject(dependencies.BrowserServiceFactory) private readonly browserServiceFactory: BrowserServiceFactory,
    ) {}

    create(requestRecorder: RequestRecorder): BrowserActionServiceInterface {
        const browserService = this.browserServiceFactory.create(requestRecorder);
        return new BrowserActionService(browserService);
    }
}
