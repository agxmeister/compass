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
        const endpoint = { method: "POST", path: "/api/sessions" };

        this.protocolRecordBuilder.addHttpRequest(endpoint, validatedInput);
        const response = await this.httpClient.request(endpoint, validatedInput);
        const validatedOutput = createSessionResponseSchema.parse(await response.json());
        this.protocolRecordBuilder.addHttpResponse(response.status, validatedOutput);

        return validatedOutput;
    }

    async deleteSession(sessionId: string): Promise<DeleteSessionResponse> {
        const validatedInput = deleteSessionInputSchema.parse({ sessionId });
        const endpoint = { method: "DELETE", path: "/api/sessions/{{sessionId}}", parameters: { sessionId: validatedInput.sessionId } };

        this.protocolRecordBuilder.addHttpRequest(endpoint);
        const response = await this.httpClient.request(endpoint);
        const validatedOutput = deleteSessionResponseSchema.parse(await response.json());
        this.protocolRecordBuilder.addHttpResponse(response.status, validatedOutput);

        return validatedOutput;
    }

    async performAction(sessionId: string, action: Action): Promise<PerformActionResponse> {
        const validatedInput = performActionInputSchema.parse({ sessionId, action });
        const endpoint = { method: "POST", path: "/api/sessions/{{sessionId}}/actions", parameters: { sessionId: validatedInput.sessionId } };
        const body = validatedInput.action as Record<string, unknown>;

        this.protocolRecordBuilder.addHttpRequest(endpoint, body);
        const response = await this.httpClient.request(endpoint, body);
        const validatedOutput = performActionResponseSchema.parse(await response.json());
        this.protocolRecordBuilder.addHttpResponse(response.status, validatedOutput);

        return validatedOutput;
    }

    async captureScreenshot(sessionId: string): Promise<string> {
        const validatedInput = captureScreenshotInputSchema.parse({ sessionId });
        const endpoint = { method: "POST", path: "/api/sessions/{{sessionId}}/screenshots", parameters: { sessionId: validatedInput.sessionId } };

        const response = await this.httpClient.request(endpoint);
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const screenshotPath = await this.screenshotService.saveScreenshot(base64);
        this.protocolRecordBuilder.addScreenshot(screenshotPath);
        return base64;
    }
}
