import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { ProtocolServiceInterface } from '@/modules/journey/index.js';
import { ProtocolRecordBuilderFactory } from '@/modules/journey/index.js';
import type { BrowserServiceFactory } from '@/modules/browser/index.js';
import { BrowserToolOutputBuilderFactory } from './ToolOutputBuilderFactory.js';
import type { ToolService, BrowserToolContext } from './types.js';
import type { BrowserToolOutput } from './BrowserToolOutput.js';

@injectable()
export class BrowserToolService implements ToolService<BrowserToolContext, BrowserToolOutput> {
    constructor(
        @inject(dependencies.ProtocolRecordBuilderFactory) private readonly protocolRecordBuilderFactory: ProtocolRecordBuilderFactory,
        @inject(dependencies.ToolOutputBuilderFactory) private readonly toolOutputBuilderFactory: BrowserToolOutputBuilderFactory,
        @inject(dependencies.BrowserServiceFactory) private readonly browserServiceFactory: BrowserServiceFactory<Record<string, unknown> & { sessionId: string }, Record<string, unknown>, Record<string, unknown>, unknown>,
        @inject(dependencies.ProtocolService) private readonly protocolService: ProtocolServiceInterface,
    ) {}

    async execute(handler: (context: BrowserToolContext) => Promise<BrowserToolOutput>): Promise<BrowserToolOutput> {
        const protocolRecordBuilder = this.protocolRecordBuilderFactory.create();

        const browserService = this.browserServiceFactory.create(protocolRecordBuilder);
        const toolOutputBuilder = this.toolOutputBuilderFactory.create();

        const result = await handler({ browserService, toolOutputBuilder });

        await this.protocolService.addRecord(protocolRecordBuilder.build());

        return result;
    }
}
