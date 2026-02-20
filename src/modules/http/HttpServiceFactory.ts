import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { ProtocolRecordBuilder } from '@/modules/protocol/types.js';
import type { HttpClientFactory as HttpClientFactoryInterface, HttpService as HttpServiceInterface, HttpServiceFactory as HttpServiceFactoryInterface } from './types.js';
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
