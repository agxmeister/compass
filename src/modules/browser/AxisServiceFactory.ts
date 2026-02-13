import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { BrowserService, BrowserServiceFactory, ProtocolRecordBuilder } from './types.js';
import type { HttpClientFactoryInterface } from '@/modules/http/index.js';
import type { ScreenshotServiceInterface } from '@/modules/protocol/index.js';
import { AxisService } from './AxisService.js';

@injectable()
export class AxisServiceFactory implements BrowserServiceFactory {
    constructor(
        @inject(dependencies.AxisApiUrl) private readonly axisApiUrl: string,
        @inject(dependencies.HttpClientFactory) private readonly httpClientFactory: HttpClientFactoryInterface,
        @inject(dependencies.ScreenshotService) private readonly screenshotService: ScreenshotServiceInterface,
    ) {}

    create(protocolRecordBuilder: ProtocolRecordBuilder): BrowserService {
        const httpClient = this.httpClientFactory.create(this.axisApiUrl);
        return new AxisService(httpClient, protocolRecordBuilder, this.screenshotService);
    }
}
