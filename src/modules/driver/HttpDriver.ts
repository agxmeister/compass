import { z as zod } from 'zod';
import type { HttpClient, HttpEndpoint } from '@/modules/http/types.js';
import type { ProtocolRecordBuilder } from '@/modules/journey/types.js';
import type { BinaryServiceInterface, Binary } from '@/modules/binary/index.js';
import type { Driver } from './types.js';

export interface HttpCommand {
    endpoint: HttpEndpoint;
    requestBody?: Record<string, unknown>;
}

export class HttpDriver implements Driver<HttpCommand> {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly protocolRecordBuilder: ProtocolRecordBuilder,
        private readonly binaryService: BinaryServiceInterface,
    ) {
        this.protocolRecordBuilder.setType('http-api-call');
    }

    async act<T extends Record<string, unknown>>(
        command: HttpCommand,
        schema: zod.ZodType<T>,
    ): Promise<T> {
        this.protocolRecordBuilder.setHttpRequest(command.endpoint, command.requestBody);
        const response = await this.httpClient.request(command.endpoint, command.requestBody);
        const validated = schema.parse(await response.json());
        this.protocolRecordBuilder.setHttpResponse(response.status, validated);
        return validated;
    }

    async observe(command: HttpCommand): Promise<Binary> {
        const response = await this.httpClient.request(command.endpoint);
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const binary = await this.binaryService.saveScreenshot(base64);
        this.protocolRecordBuilder.addBinary(binary);
        return binary;
    }
}
