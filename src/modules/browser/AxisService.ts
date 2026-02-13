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
    ProtocolRecordBuilder,
} from "./types.js";
import type { HttpClientInterface } from '@/modules/http/index.js';
import type { ScreenshotServiceInterface } from '@/modules/protocol/index.js';

export class AxisService implements BrowserService {
    constructor(
        private readonly httpClient: HttpClientInterface,
        private readonly protocolRecordBuilder: ProtocolRecordBuilder,
        private readonly screenshotService: ScreenshotServiceInterface,
    ) {}

    async createSession(url: string): Promise<CreateSessionResponse> {
        const validatedInput = createSessionInputSchema.parse({ url });

        this.protocolRecordBuilder.addHttpRequest({ method: "POST", path: "/api/sessions" }, validatedInput);

        const response = await this.httpClient.request("/api/sessions", {
            method: "POST",
            body: JSON.stringify(validatedInput),
        });

        const validatedOutput = createSessionResponseSchema.parse(await response.json());

        this.protocolRecordBuilder.addHttpResponse(validatedOutput);

        return validatedOutput;
    }

    async deleteSession(sessionId: string): Promise<DeleteSessionResponse> {
        const validatedInput = deleteSessionInputSchema.parse({ sessionId });

        this.protocolRecordBuilder.addHttpRequest({ method: "DELETE", path: "/api/sessions/{{sessionId}}", parameters: { sessionId: validatedInput.sessionId } });

        const response = await this.httpClient.request(
            `/api/sessions/${validatedInput.sessionId}`,
            { method: "DELETE" },
        );

        const validatedOutput = deleteSessionResponseSchema.parse(await response.json());

        this.protocolRecordBuilder.addHttpResponse(validatedOutput as unknown as Record<string, unknown>);

        return validatedOutput;
    }

    async performAction(sessionId: string, action: Action): Promise<PerformActionResponse> {
        const validatedInput = performActionInputSchema.parse({ sessionId, action });

        this.protocolRecordBuilder.addHttpRequest(
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

        const validatedOutput = performActionResponseSchema.parse(await response.json());

        this.protocolRecordBuilder.addHttpResponse(validatedOutput as unknown as Record<string, unknown>);

        return validatedOutput;
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
        this.protocolRecordBuilder.addScreenshot(screenshotPath);
        return base64;
    }
}
