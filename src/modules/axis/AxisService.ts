import { injectable, inject } from 'inversify';
import { dependencies } from '@/dependencies.js';
import {
    createSessionInputSchema,
    deleteSessionInputSchema,
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
    Endpoint,
} from "./types.js";
import type { ProtocolRecordBuilder } from '../protocol/index.js';

@injectable()
export class AxisService {
    constructor(
        @inject(dependencies.AxisApiUrl) private readonly baseApiUrl: string,
    ) {}

    private replacePlaceholders(path: string, parameters: Record<string, any>): string {
        return path.replace(/\{\{(\w+)\}\}/g, (_, key) => {
            return parameters[key] ?? `{{${key}}}`;
        });
    }

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

    private async apiRequestJson(
        endpoint: Endpoint,
        options: RequestInit = {},
        recordBuilder?: ProtocolRecordBuilder,
    ): Promise<any> {
        const parameters = endpoint.parameters ?? {};
        const url = this.replacePlaceholders(endpoint.path, parameters);

        const response = await this.apiRequest(url, options);
        const result = await response.json();

        if (recordBuilder) {
            recordBuilder
                .addRequest(
                    { path: endpoint.path, parameters },
                    options.body ? JSON.parse(options.body as string) : undefined,
                )
                .addResponse(result);
        }

        return result;
    }

    async createSession(url: string, recordBuilder?: ProtocolRecordBuilder): Promise<CreateSessionResponse> {
        const validatedInput = createSessionInputSchema.parse({ url });

        const data = await this.apiRequestJson(
            { path: "/api/sessions" },
            {
                method: "POST",
                body: JSON.stringify(validatedInput),
            },
            recordBuilder,
        );

        return createSessionResponseSchema.parse(data);
    }

    async deleteSession(sessionId: string, recordBuilder?: ProtocolRecordBuilder): Promise<DeleteSessionResponse> {
        const validatedInput = deleteSessionInputSchema.parse({ sessionId });

        const data = await this.apiRequestJson(
            {
                path: "/api/sessions/{{sessionId}}",
                parameters: { sessionId: validatedInput.sessionId },
            },
            {
                method: "DELETE",
            },
            recordBuilder,
        );

        return deleteSessionResponseSchema.parse(data);
    }

    async performAction(sessionId: string, action: Action, recordBuilder?: ProtocolRecordBuilder): Promise<PerformActionResponse> {
        const validatedInput = performActionInputSchema.parse({ sessionId, action });

        const data = await this.apiRequestJson(
            {
                path: "/api/sessions/{{sessionId}}/actions",
                parameters: { sessionId: validatedInput.sessionId },
            },
            {
                method: "POST",
                body: JSON.stringify(validatedInput.action),
            },
            recordBuilder,
        );

        return performActionResponseSchema.parse(data);
    }

    async captureScreenshot(sessionId: string): Promise<string | null> {
        try {
            const validatedInput = deleteSessionInputSchema.parse({ sessionId });

            const response = await this.apiRequest(
                `/api/sessions/${validatedInput.sessionId}/screenshots`,
                {
                    method: "POST",
                }
            );

            const arrayBuffer = await response.arrayBuffer();
            return Buffer.from(arrayBuffer).toString('base64');
        } catch (error) {
            console.error('Failed to capture screenshot:', error);
            return null;
        }
    }
}
