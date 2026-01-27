import { z as zod } from 'zod';
import { httpConfigSchema } from './schemas.js';

export type HttpClientConfig = zod.infer<typeof httpConfigSchema>;

export type HttpRequestOptions = {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
};

export interface HttpClientInterface {
    request(url: string, options?: HttpRequestOptions): Promise<Response>;
}
