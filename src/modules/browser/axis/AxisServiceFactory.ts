import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { BrowserService, BrowserServiceFactory } from '../types.js';
import type { ProtocolRecordBuilder } from '@/modules/journey/types.js';
import type { DriverFactory, HttpCommand } from '@/modules/driver/index.js';
import type { BinaryServiceInterface } from '@/modules/binary/index.js';
import type { CreateSessionPayload, DeletedSessionPayload, PerformActionPayload, Action } from './types.js';
import { AxisService } from './AxisService.js';

@injectable()
export class AxisServiceFactory implements BrowserServiceFactory<CreateSessionPayload, DeletedSessionPayload, PerformActionPayload, Action> {
    constructor(
        @inject(dependencies.BrowserDriverFactory) private readonly driverFactory: DriverFactory<HttpCommand>,
        @inject(dependencies.BinaryService) private readonly binaryService: BinaryServiceInterface,
    ) {}

    create(protocolRecordBuilder: ProtocolRecordBuilder): BrowserService<CreateSessionPayload, DeletedSessionPayload, PerformActionPayload, Action> {
        const driver = this.driverFactory.create(protocolRecordBuilder);
        return new AxisService(driver, this.binaryService);
    }
}
