import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { HttpServiceFactoryInterface } from '@/modules/http/index.js';
import type { BrowserService, BrowserServiceFactory, ProtocolRecordBuilder } from './types.js';
import type { ScreenshotServiceInterface } from '@/modules/protocol/index.js';
import { AxisService } from './AxisService.js';

@injectable()
export class AxisServiceFactory implements BrowserServiceFactory {
    constructor(
        @inject(dependencies.AxisApiUrl) private readonly axisApiUrl: string,
        @inject(dependencies.HttpServiceFactory) private readonly httpServiceFactory: HttpServiceFactoryInterface,
        @inject(dependencies.ScreenshotService) private readonly screenshotService: ScreenshotServiceInterface,
    ) {}

    create(protocolRecordBuilder: ProtocolRecordBuilder): BrowserService {
        const httpService = this.httpServiceFactory.create(this.axisApiUrl, protocolRecordBuilder);
        return new AxisService(httpService, protocolRecordBuilder, this.screenshotService);
    }
}
