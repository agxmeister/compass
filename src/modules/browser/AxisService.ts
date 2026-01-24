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
} from "./types.js";

@injectable()
export class AxisService implements BrowserService {
    constructor(
        @inject(dependencies.AxisApiUrl) private readonly baseApiUrl: string,
    ) {}

    private async apiRequest(url: string, options: RequestInit = {}): Promise<Response> {
        const response = await fetch(`${this.baseApiUrl}${url}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API request failed: ${response.statusText}`);
        }

        return response;
    }

    async createSession(url: string): Promise<CreateSessionResponse> {
        const validatedInput = createSessionInputSchema.parse({ url });

        const response = await this.apiRequest("/api/sessions", {
            method: "POST",
            body: JSON.stringify(validatedInput),
        });

        const data = await response.json();
        return createSessionResponseSchema.parse(data);
    }

    async deleteSession(sessionId: string): Promise<DeleteSessionResponse> {
        const validatedInput = deleteSessionInputSchema.parse({ sessionId });

        const response = await this.apiRequest(
            `/api/sessions/${validatedInput.sessionId}`,
            { method: "DELETE" },
        );

        const data = await response.json();
        return deleteSessionResponseSchema.parse(data);
    }

    async performAction(sessionId: string, action: Action): Promise<PerformActionResponse> {
        const validatedInput = performActionInputSchema.parse({ sessionId, action });

        const response = await this.apiRequest(
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

            const response = await this.apiRequest(
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
