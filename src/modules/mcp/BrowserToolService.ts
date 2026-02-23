import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { ProtocolServiceInterface } from '@/modules/protocol/index.js';
import { ProtocolRecordBuilderFactory } from '@/modules/protocol/index.js';
import type { BrowserServiceFactory } from '@/modules/browser/index.js';
import { ToolResultBuilderFactory } from './ToolResultBuilderFactory.js';
import type { ToolOutput, ToolService, BrowserToolContext } from './types.js';

@injectable()
export class BrowserToolService implements ToolService<BrowserToolContext> {
    constructor(
        @inject(dependencies.ProtocolRecordBuilderFactory) private readonly protocolRecordBuilderFactory: ProtocolRecordBuilderFactory,
        @inject(dependencies.ToolResultBuilderFactory) private readonly toolResultBuilderFactory: ToolResultBuilderFactory,
        @inject(dependencies.BrowserServiceFactory) private readonly browserServiceFactory: BrowserServiceFactory,
        @inject(dependencies.ProtocolService) private readonly protocolService: ProtocolServiceInterface,
    ) {}

    async execute(handler: (context: BrowserToolContext) => Promise<ToolOutput>): Promise<ToolOutput> {
        const protocolRecordBuilder = this.protocolRecordBuilderFactory.create();

        const browserService = this.browserServiceFactory.create(protocolRecordBuilder);
        const toolResultBuilder = this.toolResultBuilderFactory.create();

        const result = await handler({ browserService, toolResultBuilder });

        await this.protocolService.addRecord(protocolRecordBuilder.build());

        return result;
    }
}
