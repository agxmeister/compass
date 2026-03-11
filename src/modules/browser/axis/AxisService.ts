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
} from "./types.js";
import type { BrowserService } from "../types.js";
import type { Driver, HttpCommand } from "@/modules/driver/index.js";
import type { BinaryServiceInterface } from "@/modules/binary/index.js";

export class AxisService implements BrowserService<CreateSessionResponse & { sessionId: string }, DeleteSessionResponse, PerformActionResponse, Action> {
    constructor(
        private readonly driver: Driver<HttpCommand>,
        private readonly binaryService: BinaryServiceInterface,
    ) {}

    async createSession(url: string): Promise<CreateSessionResponse & { sessionId: string }> {
        const validatedInput = createSessionInputSchema.parse({ url });
        const response = await this.driver.act(
            {
                endpoint: {
                    method: "POST",
                    path: "/api/sessions",
                },
                requestBody: validatedInput,
            },
            createSessionResponseSchema,
        );
        return { ...response, sessionId: response.payload.id };
    }

    async deleteSession(sessionId: string): Promise<DeleteSessionResponse> {
        const validatedInput = deleteSessionInputSchema.parse({ sessionId });
        return this.driver.act(
            {
                endpoint: {
                    method: "DELETE",
                    path: "/api/sessions/{{sessionId}}",
                    parameters: {
                        sessionId: validatedInput.sessionId,
                    },
                },
            },
            deleteSessionResponseSchema,
        );
    }

    async performAction(sessionId: string, action: Action): Promise<PerformActionResponse> {
        const validatedInput = performActionInputSchema.parse({ sessionId, action });
        return this.driver.act(
            {
                endpoint: {
                    method: "POST",
                    path: "/api/sessions/{{sessionId}}/actions",
                    parameters: {
                        sessionId: validatedInput.sessionId,
                    },
                },
                requestBody: validatedInput.action,
            },
            performActionResponseSchema,
        );
    }

    async captureScreenshot(sessionId: string): Promise<string> {
        const validatedInput = captureScreenshotInputSchema.parse({ sessionId });
        const binary = await this.driver.observe({
            endpoint: {
                method: "POST",
                path: "/api/sessions/{{sessionId}}/screenshots",
                parameters: {
                    sessionId: validatedInput.sessionId,
                },
            },
        });
        return this.binaryService.getScreenshotContent(binary);
    }
}
