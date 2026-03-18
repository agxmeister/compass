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
    CreateSessionPayload,
    DeletedSessionPayload,
    PerformActionPayload,
    Action,
} from "./types.js";
import type { BrowserService, CreateSessionResult, DeleteSessionResult, PerformActionResult } from "../types.js";
import type { Driver, HttpCommand } from "@/modules/driver/index.js";
import type { BinaryServiceInterface } from "@/modules/binary/index.js";

export class AxisService implements BrowserService<CreateSessionPayload, DeletedSessionPayload, PerformActionPayload, Action> {
    constructor(
        private readonly driver: Driver<HttpCommand>,
        private readonly binaryService: BinaryServiceInterface,
    ) {}

    async createSession(url: string): Promise<CreateSessionResult<CreateSessionPayload>> {
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
        return { sessionId: response.payload.id, ...response.payload };
    }

    async deleteSession(sessionId: string): Promise<DeleteSessionResult<DeletedSessionPayload>> {
        const validatedInput = deleteSessionInputSchema.parse({ sessionId });
        const response = await this.driver.act(
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
        return response.payload;
    }

    async performAction(sessionId: string, action: Action): Promise<PerformActionResult<PerformActionPayload>> {
        const validatedInput = performActionInputSchema.parse({ sessionId, action });
        const response = await this.driver.act(
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
        return response.payload;
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
