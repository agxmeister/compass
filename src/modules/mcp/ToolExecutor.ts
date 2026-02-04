import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { ProtocolRecordBuilderFactory, ProtocolRecordBuilder } from '@/modules/protocol/index.js';

@injectable()
export class ToolExecutor {
    constructor(
        @inject(dependencies.ProtocolRecordBuilderFactory) private readonly protocolRecordBuilderFactory: ProtocolRecordBuilderFactory,
    ) {}

    async execute(
        handler: (protocolRecordBuilder: ProtocolRecordBuilder) => Promise<CallToolResult>,
    ): Promise<CallToolResult> {
        const protocolRecordBuilder = this.protocolRecordBuilderFactory.create();
        return handler(protocolRecordBuilder);
    }
}
