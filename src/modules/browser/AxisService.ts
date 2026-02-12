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
import type { ScreenshotServiceInterface } from '@/modules/protocol/index.js';

export class AxisService implements BrowserService {
    constructor(
        private readonly httpClient: HttpClientInterface,
        private readonly requestRecorder: RequestRecorder,
        private readonly screenshotService: ScreenshotServiceInterface,
    ) {}

    async createSession(url: string): Promise<CreateSessionResponse> {
        const validatedInput = createSessionInputSchema.parse({ url });

        this.requestRecorder.addRequest({ method: "POST", path: "/api/sessions" }, validatedInput);

        const response = await this.httpClient.request("/api/sessions", {
            method: "POST",
            body: JSON.stringify(validatedInput),
        });

        const data = await response.json();
        const result = createSessionResponseSchema.parse(data);
        this.requestRecorder.addResponse(result as unknown as Record<string, unknown>);
        return result;
    }

    async deleteSession(sessionId: string): Promise<DeleteSessionResponse> {
        const validatedInput = deleteSessionInputSchema.parse({ sessionId });

        this.requestRecorder.addRequest({ method: "DELETE", path: "/api/sessions/{{sessionId}}", parameters: { sessionId: validatedInput.sessionId } });

        const response = await this.httpClient.request(
            `/api/sessions/${validatedInput.sessionId}`,
            { method: "DELETE" },
        );

        const data = await response.json();
        const result = deleteSessionResponseSchema.parse(data);
        this.requestRecorder.addResponse(result as unknown as Record<string, unknown>);
        return result;
    }

    async performAction(sessionId: string, action: Action): Promise<PerformActionResponse> {
        const validatedInput = performActionInputSchema.parse({ sessionId, action });

        this.requestRecorder.addRequest(
            { method: "POST", path: "/api/sessions/{{sessionId}}/actions", parameters: { sessionId: validatedInput.sessionId } },
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
        const result = performActionResponseSchema.parse(data);
        this.requestRecorder.addResponse(result as unknown as Record<string, unknown>);
        return result;
    }

    async captureScreenshot(sessionId: string): Promise<string> {
        const validatedInput = captureScreenshotInputSchema.parse({ sessionId });

        const response = await this.httpClient.request(
            `/api/sessions/${validatedInput.sessionId}/screenshots`,
            { method: "POST" },
        );

        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const screenshotPath = await this.screenshotService.saveScreenshot(base64);
        this.requestRecorder.addScreenshot(screenshotPath);
        return base64;
    }
}
