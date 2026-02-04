import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { BrowserService, BrowserServiceFactory, RequestRecorder } from './types.js';
import type { HttpClientFactoryInterface } from '@/modules/http/index.js';
import { AxisService } from './AxisService.js';

@injectable()
export class AxisServiceFactory implements BrowserServiceFactory {
    constructor(
        @inject(dependencies.AxisApiUrl) private readonly axisApiUrl: string,
        @inject(dependencies.HttpClientFactory) private readonly httpClientFactory: HttpClientFactoryInterface,
    ) {}

    create(requestRecorder: RequestRecorder): BrowserService {
        const httpClient = this.httpClientFactory.create(this.axisApiUrl);
        return new AxisService(httpClient, requestRecorder);
    }
}
