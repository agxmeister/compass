import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { BrowserService, BrowserServiceFactory, ProtocolRecordBuilder, CreateSessionResponse, DeleteSessionResponse, PerformActionResponse } from './types.js';
import type { DriverFactory, HttpCommand } from '@/modules/driver/index.js';
import type { BinaryServiceInterface } from '@/modules/binary/index.js';
import { AxisService } from './AxisService.js';

@injectable()
export class AxisServiceFactory implements BrowserServiceFactory<CreateSessionResponse, DeleteSessionResponse, PerformActionResponse> {
    constructor(
        @inject(dependencies.BrowserDriverFactory) private readonly driverFactory: DriverFactory<HttpCommand>,
        @inject(dependencies.BinaryService) private readonly binaryService: BinaryServiceInterface,
    ) {}

    create(protocolRecordBuilder: ProtocolRecordBuilder): BrowserService<CreateSessionResponse, DeleteSessionResponse, PerformActionResponse> {
        const driver = this.driverFactory.create(protocolRecordBuilder);
        return new AxisService(driver, this.binaryService);
    }
}
