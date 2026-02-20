import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { HttpClientFactoryInterface } from '@/modules/http/index.js';
import type { HttpService as HttpServiceInterface, HttpServiceFactory as HttpServiceFactoryInterface, ProtocolRecordBuilder } from './types.js';
import { HttpService } from './HttpService.js';

@injectable()
export class HttpServiceFactory implements HttpServiceFactoryInterface {
    constructor(
        @inject(dependencies.HttpClientFactory) private readonly httpClientFactory: HttpClientFactoryInterface,
    ) {}

    create(baseUrl: string, protocolRecordBuilder: ProtocolRecordBuilder): HttpServiceInterface {
        const httpClient = this.httpClientFactory.create(baseUrl);
        return new HttpService(httpClient, protocolRecordBuilder);
    }
}
