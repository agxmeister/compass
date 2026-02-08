import { injectable } from 'inversify';
import { ToolResultBuilder } from './ToolResultBuilder.js';

@injectable()
export class ToolResultBuilderFactory {
    create(): ToolResultBuilder {
        return new ToolResultBuilder();
    }
}
