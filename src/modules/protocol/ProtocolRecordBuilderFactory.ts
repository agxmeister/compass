import { injectable } from 'inversify';
import { ProtocolRecordBuilder } from './ProtocolRecordBuilder.js';

@injectable()
export class ProtocolRecordBuilderFactory {
    create(): ProtocolRecordBuilder {
        return new ProtocolRecordBuilder();
    }
}
