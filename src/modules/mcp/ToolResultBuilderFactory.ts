import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { ProtocolServiceInterface, ScreenshotServiceInterface } from '@/modules/protocol/index.js';
import type { ProtocolRecordBuilder } from '@/modules/protocol/index.js';
import { CallToolResultBuilderFactory } from './CallToolResultBuilderFactory.js';
import { ToolResultBuilder } from './ToolResultBuilder.js';

@injectable()
export class ToolResultBuilderFactory {
    constructor(
        @inject(dependencies.CallToolResultBuilderFactory) private readonly callToolResultBuilderFactory: CallToolResultBuilderFactory,
        @inject(dependencies.ScreenshotService) private readonly screenshotService: ScreenshotServiceInterface,
        @inject(dependencies.ProtocolService) private readonly protocolService: ProtocolServiceInterface,
    ) {}

    create(protocolRecordBuilder: ProtocolRecordBuilder): ToolResultBuilder {
        return new ToolResultBuilder(
            protocolRecordBuilder,
            this.callToolResultBuilderFactory,
            this.screenshotService,
            this.protocolService,
        );
    }
}
