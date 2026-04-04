import { z as zod } from 'zod';
import type { HttpClient, HttpEndpoint } from '@/modules/http/types.js';
import type { HttpProtocolRecordBuilder } from '@/modules/journey/http/types.js';
import type { BinaryServiceInterface, Binary } from '@/modules/binary/index.js';
import type { Driver } from './types.js';

export interface RestCommand {
    endpoint: HttpEndpoint;
    requestBody?: Record<string, unknown>;
}

export class RestDriver implements Driver<RestCommand> {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly protocolRecordBuilder: HttpProtocolRecordBuilder,
        private readonly binaryService: BinaryServiceInterface,
    ) {
        this.protocolRecordBuilder.setType('http-api-call');
    }

    async act<T extends Record<string, unknown>>(
        command: RestCommand,
        schema: zod.ZodType<T>,
    ): Promise<T> {
        this.protocolRecordBuilder.setHttpRequest(command.endpoint, command.requestBody);
        const response = await this.httpClient.request(command.endpoint, command.requestBody);
        if (!response.ok) {
            throw new Error(`${command.endpoint.method} ${command.endpoint.path} failed: HTTP ${response.status} ${response.statusText}`);
        }
        const body = await response.json();
        try {
            const validated = schema.parse(body);
            this.protocolRecordBuilder.setHttpResponse(response.status, validated);
            return validated;
        } catch (error) {
            throw new Error(
                `${command.endpoint.method} ${command.endpoint.path} failed: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    async observe(command: RestCommand): Promise<Binary> {
        const response = await this.httpClient.request(command.endpoint);
        if (!response.ok) {
            throw new Error(`${command.endpoint.method} ${command.endpoint.path} failed: HTTP ${response.status} ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const binary = await this.binaryService.saveScreenshot(base64);
        this.protocolRecordBuilder.addBinary(binary);
        return binary;
    }
}
