import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ProtocolServiceInterface } from '@/modules/protocol/index.js';
import { ProtocolRecordBuilderFactory, ProtocolRecordBuilder } from '@/modules/protocol/index.js';
import { ToolResultBuilderFactory } from './ToolResultBuilderFactory.js';
import type { ToolResultBuilder } from './ToolResultBuilder.js';

@injectable()
export class ToolExecutor {
    constructor(
        @inject(dependencies.ProtocolRecordBuilderFactory) private readonly protocolRecordBuilderFactory: ProtocolRecordBuilderFactory,
        @inject(dependencies.ToolResultBuilderFactory) private readonly toolResultBuilderFactory: ToolResultBuilderFactory,
        @inject(dependencies.ProtocolService) private readonly protocolService: ProtocolServiceInterface,
    ) {}

    async execute(
        handler: (protocolRecordBuilder: ProtocolRecordBuilder, toolResultBuilder: ToolResultBuilder) => Promise<CallToolResult>,
    ): Promise<CallToolResult> {
        const protocolRecordBuilder = this.protocolRecordBuilderFactory.create();
        const toolResultBuilder = this.toolResultBuilderFactory.create();
        const result = await handler(protocolRecordBuilder, toolResultBuilder);

        const record = protocolRecordBuilder.build();
        await this.protocolService.addRecord(record);

        return result;
    }
}
