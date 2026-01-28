import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import { HttpClient } from './HttpClient.js';
import type { HttpClient as HttpClientInterface, HttpClientFactory as HttpClientFactoryInterface } from './types.js';

@injectable()
export class HttpClientFactory implements HttpClientFactoryInterface {
    constructor(
        @inject(dependencies.HttpTimeout) private readonly timeout: number,
    ) {}

    create(baseUrl: string): HttpClientInterface {
        return new HttpClient(baseUrl, this.timeout);
    }
}
