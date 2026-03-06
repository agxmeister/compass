import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { BrowserService, BrowserServiceFactory, ProtocolRecordBuilder } from './types.js';
import type { DriverFactory, HttpCommand } from '@/modules/driver/index.js';
import type { BinaryServiceInterface } from '@/modules/binary/index.js';
import { AxisService } from './AxisService.js';

@injectable()
export class AxisServiceFactory implements BrowserServiceFactory {
    constructor(
        @inject(dependencies.BrowserDriverFactory) private readonly driverFactory: DriverFactory<HttpCommand>,
        @inject(dependencies.BinaryService) private readonly binaryService: BinaryServiceInterface,
    ) {}

    create(protocolRecordBuilder: ProtocolRecordBuilder): BrowserService {
        const driver = this.driverFactory.create(protocolRecordBuilder);
        return new AxisService(driver, this.binaryService);
    }
}
