import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ProtocolServiceInterface } from '@/modules/protocol/index.js';
import { ProtocolRecordBuilderFactory, ProtocolRecordBuilder } from '@/modules/protocol/index.js';

@injectable()
export class ToolExecutor {
    constructor(
        @inject(dependencies.ProtocolRecordBuilderFactory) private readonly protocolRecordBuilderFactory: ProtocolRecordBuilderFactory,
        @inject(dependencies.ProtocolService) private readonly protocolService: ProtocolServiceInterface,
    ) {}

    async execute(
        handler: (protocolRecordBuilder: ProtocolRecordBuilder) => Promise<CallToolResult>,
    ): Promise<CallToolResult> {
        const protocolRecordBuilder = this.protocolRecordBuilderFactory.create();
        const result = await handler(protocolRecordBuilder);

        const record = protocolRecordBuilder.build();
        await this.protocolService.addRecord(record);

        return result;
    }
}
