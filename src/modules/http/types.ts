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
