import { z as zod } from 'zod';

export type HttpEndpoint = {
    method: string;
    path: string;
    parameters?: Record<string, unknown>;
};

export interface HttpClient {
    request(endpoint: HttpEndpoint, body?: Record<string, unknown>): Promise<Response>;
}

export interface HttpClientFactory {
    create(baseUrl: string): HttpClient;
}

export interface HttpService {
    requestJson<T extends Record<string, unknown>>(endpoint: HttpEndpoint, schema: zod.ZodType<T>, body?: Record<string, unknown>): Promise<T>;
    requestBinary(endpoint: HttpEndpoint): Promise<ArrayBuffer>;
}

export interface HttpServiceFactory {
    create(baseUrl: string): HttpService;
}
