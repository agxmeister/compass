import {
    createSessionInputSchema,
    deleteSessionInputSchema,
    captureScreenshotInputSchema,
    performActionInputSchema,
    createSessionResponseSchema,
    deleteSessionResponseSchema,
    performActionResponseSchema,
} from "./schemas.js";
import type { HttpServiceInterface as HttpService } from '@/modules/http/index.js';
import type {
    CreateSessionResponse,
    DeleteSessionResponse,
    PerformActionResponse,
    CaptureScreenshotResponse,
    Action,
    BrowserService,
    ProtocolRecordBuilder,
} from "./types.js";
import type { ScreenshotServiceInterface } from '@/modules/protocol/index.js';

export class AxisService implements BrowserService {
    constructor(
        private readonly httpService: HttpService,
        private readonly protocolRecordBuilder: ProtocolRecordBuilder,
        private readonly screenshotService: ScreenshotServiceInterface,
    ) {}

    async createSession(url: string): Promise<CreateSessionResponse> {
        const validatedInput = createSessionInputSchema.parse({ url });
        const endpoint = { method: "POST", path: "/api/sessions" };
        return this.httpService.requestJson(endpoint, createSessionResponseSchema, validatedInput);
    }

    async deleteSession(sessionId: string): Promise<DeleteSessionResponse> {
        const validatedInput = deleteSessionInputSchema.parse({ sessionId });
        const endpoint = { method: "DELETE", path: "/api/sessions/{{sessionId}}", parameters: { sessionId: validatedInput.sessionId } };
        return this.httpService.requestJson(endpoint, deleteSessionResponseSchema);
    }

    async performAction(sessionId: string, action: Action): Promise<PerformActionResponse> {
        const validatedInput = performActionInputSchema.parse({ sessionId, action });
        const endpoint = { method: "POST", path: "/api/sessions/{{sessionId}}/actions", parameters: { sessionId: validatedInput.sessionId } };
        const body = validatedInput.action as Record<string, unknown>;
        return this.httpService.requestJson(endpoint, performActionResponseSchema, body);
    }

    async captureScreenshot(sessionId: string): Promise<CaptureScreenshotResponse> {
        const validatedInput = captureScreenshotInputSchema.parse({ sessionId });
        const endpoint = { method: "POST", path: "/api/sessions/{{sessionId}}/screenshots", parameters: { sessionId: validatedInput.sessionId } };
        const arrayBuffer = await this.httpService.requestBinary(endpoint);
        const body = Buffer.from(arrayBuffer).toString('base64');
        const path = await this.screenshotService.saveScreenshot(body);
        this.protocolRecordBuilder.addBinary(path, "image/png");
        return { path, body };
    }
}
