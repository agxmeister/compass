import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import {
    createSessionInputSchema,
    deleteSessionInputSchema,
    captureScreenshotInputSchema,
    performActionInputSchema,
    createSessionResponseSchema,
    deleteSessionResponseSchema,
    performActionResponseSchema,
} from "./schemas.js";
import type {
    CreateSessionResponse,
    DeleteSessionResponse,
    PerformActionResponse,
    Action,
    BrowserService,
    RequestRecorder,
} from "./types.js";
import type { HttpClientInterface, HttpClientFactoryInterface } from '@/modules/http/index.js';

@injectable()
export class AxisService implements BrowserService {
    private readonly httpClient: HttpClientInterface;

    constructor(
        @inject(dependencies.AxisApiUrl) axisApiUrl: string,
        @inject(dependencies.HttpClientFactory) httpClientFactory: HttpClientFactoryInterface,
    ) {
        this.httpClient = httpClientFactory.create(axisApiUrl);
    }

    async createSession(url: string, requestRecorder: RequestRecorder): Promise<CreateSessionResponse> {
        const validatedInput = createSessionInputSchema.parse({ url });

        requestRecorder.addRequest({ path: "/api/sessions" }, validatedInput);

        const response = await this.httpClient.request("/api/sessions", {
            method: "POST",
            body: JSON.stringify(validatedInput),
        });

        const data = await response.json();
        return createSessionResponseSchema.parse(data);
    }

    async deleteSession(sessionId: string, requestRecorder: RequestRecorder): Promise<DeleteSessionResponse> {
        const validatedInput = deleteSessionInputSchema.parse({ sessionId });

        requestRecorder.addRequest({ path: "/api/sessions/{{sessionId}}", parameters: { sessionId: validatedInput.sessionId } });

        const response = await this.httpClient.request(
            `/api/sessions/${validatedInput.sessionId}`,
            { method: "DELETE" },
        );

        const data = await response.json();
        return deleteSessionResponseSchema.parse(data);
    }

    async performAction(sessionId: string, action: Action, requestRecorder: RequestRecorder): Promise<PerformActionResponse> {
        const validatedInput = performActionInputSchema.parse({ sessionId, action });

        requestRecorder.addRequest(
            { path: "/api/sessions/{{sessionId}}/actions", parameters: { sessionId: validatedInput.sessionId } },
            validatedInput.action as Record<string, unknown>,
        );

        const response = await this.httpClient.request(
            `/api/sessions/${validatedInput.sessionId}/actions`,
            {
                method: "POST",
                body: JSON.stringify(validatedInput.action),
            },
        );

        const data = await response.json();
        return performActionResponseSchema.parse(data);
    }

    async captureScreenshot(sessionId: string): Promise<string | null> {
        try {
            const validatedInput = captureScreenshotInputSchema.parse({ sessionId });

            const response = await this.httpClient.request(
                `/api/sessions/${validatedInput.sessionId}/screenshots`,
                { method: "POST" },
            );

            const arrayBuffer = await response.arrayBuffer();
            return Buffer.from(arrayBuffer).toString('base64');
        } catch (error) {
            console.error('Failed to capture screenshot:', error);
            return null;
        }
    }
}
