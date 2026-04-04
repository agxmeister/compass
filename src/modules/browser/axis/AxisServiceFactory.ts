import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { BrowserService, BrowserServiceFactory } from '../types.js';
import type { HttpProtocolRecordBuilder } from '@/modules/journey/http/types.js';
import type { DriverFactory, RestCommand } from '@/modules/driver/index.js';
import type { BinaryServiceInterface } from '@/modules/binary/index.js';
import type { CreateSessionPayload, DeletedSessionPayload, PerformActionPayload, Action } from './types.js';
import { AxisService } from './AxisService.js';

@injectable()
export class AxisServiceFactory implements BrowserServiceFactory<CreateSessionPayload, DeletedSessionPayload, PerformActionPayload, Action> {
    constructor(
        @inject(dependencies.BrowserDriverFactory) private readonly driverFactory: DriverFactory<RestCommand>,
        @inject(dependencies.BinaryService) private readonly binaryService: BinaryServiceInterface,
    ) {}

    create(protocolRecordBuilder: HttpProtocolRecordBuilder): BrowserService<CreateSessionPayload, DeletedSessionPayload, PerformActionPayload, Action> {
        const driver = this.driverFactory.create(protocolRecordBuilder);
        return new AxisService(driver, this.binaryService);
    }
}
