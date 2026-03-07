import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { BinaryServiceInterface } from '@/modules/binary/index.js';
import { ProtocolRecordBuilder } from './ProtocolRecordBuilder.js';

@injectable()
export class ProtocolRecordBuilderFactory {
    constructor(
        @inject(dependencies.BinaryService) private readonly binaryService: BinaryServiceInterface,
    ) {}

    create(): ProtocolRecordBuilder {
        return new ProtocolRecordBuilder(this.binaryService);
    }
}
