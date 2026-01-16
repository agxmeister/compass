import { injectable } from 'inversify';
import { CallToolResultBuilder } from './CallToolResultBuilder.js';

@injectable()
export class CallToolResultBuilderFactory {
    create(): CallToolResultBuilder {
        return new CallToolResultBuilder();
    }
}
