import { z as zod } from 'zod';
import type { ProtocolRecordBuilder } from '@/modules/protocol/types.js';
import type { HttpClient, HttpEndpoint, HttpService as HttpServiceInterface } from './types.js';

export class HttpService implements HttpServiceInterface {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly protocolRecordBuilder: ProtocolRecordBuilder,
    ) {}

    async requestJson<T extends Record<string, unknown>>(
        endpoint: HttpEndpoint,
        schema: zod.ZodType<T>,
        body?: Record<string, unknown>,
    ): Promise<T> {
        this.protocolRecordBuilder.addHttpRequest(endpoint, body);
        const response = await this.httpClient.request(endpoint, body);
        const validated = schema.parse(await response.json());
        this.protocolRecordBuilder.addHttpResponse(response.status, validated);
        return validated;
    }

    async requestBinary(endpoint: HttpEndpoint): Promise<ArrayBuffer> {
        const response = await this.httpClient.request(endpoint);
        return response.arrayBuffer();
    }
}
