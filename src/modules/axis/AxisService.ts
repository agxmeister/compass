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
    ResultOptions,
} from "./types.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { CallToolResultBuilder } from '@/modules/mcp/index.js';
import { ProtocolRecordBuilder, ScreenshotService, ProtocolService } from '../protocol/index.js';

@injectable()
export class AxisService {
    constructor(
        @inject(dependencies.AxisApiUrl) private readonly baseApiUrl: string,
        @inject(dependencies.ProtocolRecordBuilder) private readonly recordBuilder: ProtocolRecordBuilder,
        @inject(dependencies.CallToolResultBuilder) private readonly resultBuilder: CallToolResultBuilder,
        @inject(dependencies.ScreenshotService) private readonly screenshotService: ScreenshotService,
        @inject(dependencies.ProtocolService) private readonly protocolService: ProtocolService,
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
    ): Promise<any> {
        const parameters = endpoint.parameters ?? {};
        const url = this.replacePlaceholders(endpoint.path, parameters);

        const response = await this.apiRequest(url, options);
        const result = await response.json();

        this.recordBuilder
            .addRequest(
                { path: endpoint.path, parameters },
                options.body ? JSON.parse(options.body as string) : undefined,
            )
            .addResponse(result);

        return result;
    }

    private async captureScreenshot(sessionId: string): Promise<string | null> {
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

    private async buildResult(
        text: string,
        options?: ResultOptions,
    ): Promise<CallToolResult> {
        this.resultBuilder.reset().addText(text);

        if (options?.sessionId && options?.includeScreenshot) {
            const screenshot = await this.captureScreenshot(options.sessionId);
            if (screenshot) {
                this.resultBuilder.addScreenshot(screenshot);

                const screenshotPath = await this.screenshotService.saveScreenshot(screenshot);
                this.recordBuilder.addScreenshot(screenshotPath);
            }
        }

        const record = this.recordBuilder.build();
        await this.protocolService.addRecord(record);

        return this.resultBuilder.build();
    }

    async createSession(
        url: string,
        formatResult: (result: CreateSessionResponse) => string,
        options?: ResultOptions,
    ): Promise<CallToolResult> {
        this.recordBuilder.reset();

        const validatedInput = createSessionInputSchema.parse({ url });

        const data = await this.apiRequestJson(
            { path: "/api/sessions" },
            {
                method: "POST",
                body: JSON.stringify(validatedInput),
            },
        );

        const result = createSessionResponseSchema.parse(data);
        const text = formatResult(result);

        return this.buildResult(text, {
            sessionId: result.payload.id,
            includeScreenshot: options?.includeScreenshot,
        });
    }

    async deleteSession(
        sessionId: string,
        formatResult: (result: DeleteSessionResponse) => string,
    ): Promise<CallToolResult> {
        this.recordBuilder.reset();

        const validatedInput = deleteSessionInputSchema.parse({ sessionId });

        const data = await this.apiRequestJson(
            {
                path: "/api/sessions/{{sessionId}}",
                parameters: { sessionId: validatedInput.sessionId },
            },
            {
                method: "DELETE",
            },
        );

        const result = deleteSessionResponseSchema.parse(data);
        const text = formatResult(result);

        return this.buildResult(text);
    }

    async performAction(
        sessionId: string,
        action: Action,
        formatResult: (result: PerformActionResponse) => string,
        options?: ResultOptions,
    ): Promise<CallToolResult> {
        this.recordBuilder.reset();

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
        );

        const result = performActionResponseSchema.parse(data);
        const text = formatResult(result);

        return this.buildResult(text, {
            sessionId,
            includeScreenshot: options?.includeScreenshot,
        });
    }
}
