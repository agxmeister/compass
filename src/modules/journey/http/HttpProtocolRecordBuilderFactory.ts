import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { BinaryServiceInterface } from '@/modules/binary/index.js';
import { HttpProtocolRecordBuilder } from './HttpProtocolRecordBuilder.js';

@injectable()
export class HttpProtocolRecordBuilderFactory {
    constructor(
        @inject(dependencies.BinaryService) private readonly binaryService: BinaryServiceInterface,
    ) {}

    create(): HttpProtocolRecordBuilder {
        return new HttpProtocolRecordBuilder(this.binaryService);
    }
}
