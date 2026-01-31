import type { HttpClient as HttpClientInterface, HttpRequestOptions } from './types.js';

export class HttpClient implements HttpClientInterface {
    constructor(
        private readonly baseUrl: string,
        private readonly timeout: number,
    ) {}

    async request(url: string, options: HttpRequestOptions = {}): Promise<Response> {
        return fetch(`${this.baseUrl}${url}`, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            body: options.body,
            signal: AbortSignal.timeout(this.timeout),
        });
    }
}
