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
    CaptureScreenshotResponse,
    Action,
    BrowserService,
    BrowserDriver,
} from "./types.js";

export class AxisService implements BrowserService {
    constructor(
        private readonly driver: BrowserDriver,
    ) {}

    async createSession(url: string): Promise<CreateSessionResponse> {
        const validatedInput = createSessionInputSchema.parse({ url });
        return this.driver.act({ method: "POST", path: "/api/sessions" }, createSessionResponseSchema, validatedInput);
    }

    async deleteSession(sessionId: string): Promise<DeleteSessionResponse> {
        const validatedInput = deleteSessionInputSchema.parse({ sessionId });
        return this.driver.act({ method: "DELETE", path: "/api/sessions/{{sessionId}}", parameters: { sessionId: validatedInput.sessionId } }, deleteSessionResponseSchema);
    }

    async performAction(sessionId: string, action: Action): Promise<PerformActionResponse> {
        const validatedInput = performActionInputSchema.parse({ sessionId, action });
        return this.driver.act({ method: "POST", path: "/api/sessions/{{sessionId}}/actions", parameters: { sessionId: validatedInput.sessionId } }, performActionResponseSchema, validatedInput.action as Record<string, unknown>);
    }

    async captureScreenshot(sessionId: string): Promise<CaptureScreenshotResponse> {
        const validatedInput = captureScreenshotInputSchema.parse({ sessionId });
        return this.driver.observe({ method: "POST", path: "/api/sessions/{{sessionId}}/screenshots", parameters: { sessionId: validatedInput.sessionId } }, "image/png");
    }
}
