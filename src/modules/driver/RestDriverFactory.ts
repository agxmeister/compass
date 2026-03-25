import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { HttpClientFactoryInterface } from '@/modules/http/index.js';
import type { ProtocolRecordBuilder } from '@/modules/journey/types.js';
import type { BinaryServiceInterface } from '@/modules/binary/index.js';
import type { DriverFactory } from './types.js';
import { RestDriver, type RestCommand } from './RestDriver.js';

@injectable()
export class RestDriverFactory implements DriverFactory<RestCommand> {
    constructor(
        @inject(dependencies.AxisApiUrl) private readonly axisApiUrl: string,
        @inject(dependencies.HttpClientFactory) private readonly httpClientFactory: HttpClientFactoryInterface,
        @inject(dependencies.BinaryService) private readonly binaryService: BinaryServiceInterface,
    ) {}

    create(protocolRecordBuilder: ProtocolRecordBuilder): RestDriver {
        const httpClient = this.httpClientFactory.create(this.axisApiUrl);
        return new RestDriver(httpClient, protocolRecordBuilder, this.binaryService);
    }
}
