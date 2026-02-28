import { z as zod } from 'zod';
import type { HttpClient, HttpEndpoint } from '@/modules/http/types.js';
import type { ProtocolRecordBuilder } from '@/modules/journey/types.js';
import type { BinaryServiceInterface } from '@/modules/journey/index.js';
import type { BrowserDriver as BrowserDriverInterface, CaptureScreenshotResponse } from './types.js';

export class HttpBrowserDriver implements BrowserDriverInterface {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly protocolRecordBuilder: ProtocolRecordBuilder,
        private readonly binaryService: BinaryServiceInterface,
    ) {}

    async act<T extends Record<string, unknown>>(
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

    async observe(endpoint: HttpEndpoint, type: string): Promise<CaptureScreenshotResponse> {
        const response = await this.httpClient.request(endpoint);
        const arrayBuffer = await response.arrayBuffer();
        const body = Buffer.from(arrayBuffer).toString('base64');
        const path = await this.binaryService.saveScreenshot(body);
        this.protocolRecordBuilder.addBinary(path, type);
        return { path, body };
    }
}
