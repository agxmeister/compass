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
} from "./types.js";
import type { Driver } from "@/modules/driver/index.js";
import type { HttpCommand } from "@/modules/driver/index.js";

export class AxisService implements BrowserService {
    constructor(
        private readonly driver: Driver<HttpCommand>,
    ) {}

    async createSession(url: string): Promise<CreateSessionResponse> {
        const validatedInput = createSessionInputSchema.parse({ url });
        return this.driver.act(
            { endpoint: { method: "POST", path: "/api/sessions" }, body: validatedInput },
            createSessionResponseSchema,
        );
    }

    async deleteSession(sessionId: string): Promise<DeleteSessionResponse> {
        const validatedInput = deleteSessionInputSchema.parse({ sessionId });
        return this.driver.act(
            { endpoint: { method: "DELETE", path: "/api/sessions/{{sessionId}}", parameters: { sessionId: validatedInput.sessionId } } },
            deleteSessionResponseSchema,
        );
    }

    async performAction(sessionId: string, action: Action): Promise<PerformActionResponse> {
        const validatedInput = performActionInputSchema.parse({ sessionId, action });
        return this.driver.act(
            { endpoint: { method: "POST", path: "/api/sessions/{{sessionId}}/actions", parameters: { sessionId: validatedInput.sessionId } }, body: validatedInput.action as Record<string, unknown> },
            performActionResponseSchema,
        );
    }

    async captureScreenshot(sessionId: string): Promise<CaptureScreenshotResponse> {
        const validatedInput = captureScreenshotInputSchema.parse({ sessionId });
        return this.driver.observe(
            { endpoint: { method: "POST", path: "/api/sessions/{{sessionId}}/screenshots", parameters: { sessionId: validatedInput.sessionId } } },
            "image/png",
        );
    }
}
