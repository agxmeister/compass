import type { HttpClientInterface, HttpRequestOptions } from './types.js';

export class HttpClient implements HttpClientInterface {
    constructor(
        private readonly baseUrl: string,
        private readonly timeout: number,
    ) {}

    async request(url: string, options: HttpRequestOptions = {}): Promise<Response> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(`${this.baseUrl}${url}`, {
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                body: options.body,
                signal: controller.signal,
            });
            return response;
        } finally {
            clearTimeout(timeoutId);
        }
    }
}
