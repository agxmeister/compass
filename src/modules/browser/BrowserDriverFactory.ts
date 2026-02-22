import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { HttpClientFactoryInterface } from '@/modules/http/index.js';
import type { ProtocolRecordBuilder } from '@/modules/protocol/types.js';
import type { ScreenshotServiceInterface } from '@/modules/protocol/index.js';
import type { BrowserDriverFactory as BrowserDriverFactoryInterface } from './types.js';
import { BrowserDriver } from './BrowserDriver.js';

@injectable()
export class BrowserDriverFactory implements BrowserDriverFactoryInterface {
    constructor(
        @inject(dependencies.AxisApiUrl) private readonly axisApiUrl: string,
        @inject(dependencies.HttpClientFactory) private readonly httpClientFactory: HttpClientFactoryInterface,
        @inject(dependencies.ScreenshotService) private readonly screenshotService: ScreenshotServiceInterface,
    ) {}

    create(protocolRecordBuilder: ProtocolRecordBuilder): BrowserDriver {
        const httpClient = this.httpClientFactory.create(this.axisApiUrl);
        return new BrowserDriver(httpClient, protocolRecordBuilder, this.screenshotService);
    }
}
