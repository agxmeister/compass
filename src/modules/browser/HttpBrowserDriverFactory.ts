import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { HttpClientFactoryInterface } from '@/modules/http/index.js';
import type { ProtocolRecordBuilder } from '@/modules/protocol/types.js';
import type { BinaryServiceInterface } from '@/modules/protocol/index.js';
import type { BrowserDriverFactory } from './types.js';
import { HttpBrowserDriver } from './HttpBrowserDriver.js';

@injectable()
export class HttpBrowserDriverFactory implements BrowserDriverFactory {
    constructor(
        @inject(dependencies.AxisApiUrl) private readonly axisApiUrl: string,
        @inject(dependencies.HttpClientFactory) private readonly httpClientFactory: HttpClientFactoryInterface,
        @inject(dependencies.BinaryService) private readonly binaryService: BinaryServiceInterface,
    ) {}

    create(protocolRecordBuilder: ProtocolRecordBuilder): HttpBrowserDriver {
        const httpClient = this.httpClientFactory.create(this.axisApiUrl);
        return new HttpBrowserDriver(httpClient, protocolRecordBuilder, this.binaryService);
    }
}
