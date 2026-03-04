import { z as zod } from 'zod';
import type { HttpClient, HttpEndpoint } from '@/modules/http/types.js';
import type { ProtocolRecordBuilder } from '@/modules/journey/types.js';
import type { BinaryServiceInterface } from '@/modules/binary/index.js';
import type { Driver, CaptureScreenshotResponse } from './types.js';

export interface HttpCommand {
    endpoint: HttpEndpoint;
    body?: Record<string, unknown>;
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
        this.protocolRecordBuilder.setHttpRequest(command.endpoint, command.body);
        const response = await this.httpClient.request(command.endpoint, command.body);
        const validated = schema.parse(await response.json());
        this.protocolRecordBuilder.setHttpResponse(response.status, validated);
        return validated;
    }

    async observe(command: HttpCommand, type: string): Promise<CaptureScreenshotResponse> {
        const response = await this.httpClient.request(command.endpoint);
        const arrayBuffer = await response.arrayBuffer();
        const body = Buffer.from(arrayBuffer).toString('base64');
        const path = await this.binaryService.saveScreenshot(body);
        this.protocolRecordBuilder.addBinary(path, type);
        return { path, body };
    }
}
