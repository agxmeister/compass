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
import type { HttpClientInterface } from '@/modules/http/index.js';

export class AxisService implements BrowserService {
    constructor(
        private readonly httpClient: HttpClientInterface,
        private readonly requestRecorder: RequestRecorder,
    ) {}

    async createSession(url: string): Promise<CreateSessionResponse> {
        const validatedInput = createSessionInputSchema.parse({ url });

        this.requestRecorder.addRequest({ path: "/api/sessions" }, validatedInput);

        const response = await this.httpClient.request("/api/sessions", {
            method: "POST",
            body: JSON.stringify(validatedInput),
        });

        const data = await response.json();
        return createSessionResponseSchema.parse(data);
    }

    async deleteSession(sessionId: string): Promise<DeleteSessionResponse> {
        const validatedInput = deleteSessionInputSchema.parse({ sessionId });

        this.requestRecorder.addRequest({ path: "/api/sessions/{{sessionId}}", parameters: { sessionId: validatedInput.sessionId } });

        const response = await this.httpClient.request(
            `/api/sessions/${validatedInput.sessionId}`,
            { method: "DELETE" },
        );

        const data = await response.json();
        return deleteSessionResponseSchema.parse(data);
    }

    async performAction(sessionId: string, action: Action): Promise<PerformActionResponse> {
        const validatedInput = performActionInputSchema.parse({ sessionId, action });

        this.requestRecorder.addRequest(
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
