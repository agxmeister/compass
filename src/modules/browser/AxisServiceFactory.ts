import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { BrowserService, BrowserServiceFactory, BrowserDriverFactory, ProtocolRecordBuilder } from './types.js';
import { AxisService } from './AxisService.js';

@injectable()
export class AxisServiceFactory implements BrowserServiceFactory {
    constructor(
        @inject(dependencies.BrowserDriverFactory) private readonly driverFactory: BrowserDriverFactory,
    ) {}

    create(protocolRecordBuilder: ProtocolRecordBuilder): BrowserService {
        const driver = this.driverFactory.create(protocolRecordBuilder);
        return new AxisService(driver);
    }
}
