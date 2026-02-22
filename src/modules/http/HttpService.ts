import { z as zod } from 'zod';
import type { HttpClient, HttpEndpoint, HttpService as HttpServiceInterface } from './types.js';

export class HttpService implements HttpServiceInterface {
    constructor(
        private readonly httpClient: HttpClient,
    ) {}

    async requestJson<T extends Record<string, unknown>>(
        endpoint: HttpEndpoint,
        schema: zod.ZodType<T>,
        body?: Record<string, unknown>,
    ): Promise<T> {
        const response = await this.httpClient.request(endpoint, body);
        return schema.parse(await response.json());
    }

    async requestBinary(endpoint: HttpEndpoint): Promise<ArrayBuffer> {
        const response = await this.httpClient.request(endpoint);
        return response.arrayBuffer();
    }
}
