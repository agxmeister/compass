import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import { CallToolResultBuilderFactory } from './CallToolResultBuilderFactory.js';
import { ToolResultBuilder } from './ToolResultBuilder.js';

@injectable()
export class ToolResultBuilderFactory {
    constructor(
        @inject(dependencies.CallToolResultBuilderFactory) private readonly callToolResultBuilderFactory: CallToolResultBuilderFactory,
    ) {}

    create(): ToolResultBuilder {
        return new ToolResultBuilder(
            this.callToolResultBuilderFactory,
        );
    }
}
