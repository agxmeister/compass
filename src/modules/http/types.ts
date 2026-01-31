export type HttpRequestOptions = {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
};

export interface HttpClient {
    request(url: string, options?: HttpRequestOptions): Promise<Response>;
}

export interface HttpClientFactory {
    create(baseUrl: string): HttpClient;
}
