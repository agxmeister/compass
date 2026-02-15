import type { HttpClient as HttpClientInterface, HttpEndpoint } from './types.js';

export class HttpClient implements HttpClientInterface {
    constructor(
        private readonly baseUrl: string,
        private readonly timeout: number,
    ) {}

    async request(endpoint: HttpEndpoint, body?: Record<string, unknown>): Promise<Response> {
        const url = this.resolveUrl(endpoint);
        return fetch(`${this.baseUrl}${url}`, {
            method: endpoint.method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined,
            signal: AbortSignal.timeout(this.timeout),
        });
    }

    private resolveUrl(endpoint: HttpEndpoint): string {
        if (!endpoint.parameters) {
            return endpoint.path;
        }
        return Object.entries(endpoint.parameters).reduce(
            (path, [key, value]) => path.replace(`{{${key}}}`, String(value)),
            endpoint.path,
        );
    }
}
