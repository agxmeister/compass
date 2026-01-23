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
    Endpoint,
    BrowserService,
} from "./types.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { CallToolResultBuilderFactory, ResultOptions } from '@/modules/mcp/index.js';
import {
    ProtocolRecordBuilder,
    ProtocolRecordBuilderFactory,
} from '../protocol/index.js';
import type { ProtocolServiceInterface, ScreenshotServiceInterface } from '../protocol/index.js';

@injectable()
export class AxisService implements BrowserService {
    constructor(
        @inject(dependencies.AxisApiUrl) private readonly baseApiUrl: string,
        @inject(dependencies.ProtocolRecordBuilderFactory) private readonly recordBuilderFactory: ProtocolRecordBuilderFactory,
        @inject(dependencies.CallToolResultBuilderFactory) private readonly resultBuilderFactory: CallToolResultBuilderFactory,
        @inject(dependencies.ScreenshotService) private readonly screenshotService: ScreenshotServiceInterface,
        @inject(dependencies.ProtocolService) private readonly protocolService: ProtocolServiceInterface,
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
        recordBuilder: ProtocolRecordBuilder,
    ): Promise<any> {
        const parameters = endpoint.parameters ?? {};
        const url = this.replacePlaceholders(endpoint.path, parameters);

        const response = await this.apiRequest(url, options);
        const result = await response.json();

        recordBuilder
            .addRequest(
                { path: endpoint.path, parameters },
                options.body ? JSON.parse(options.body as string) : undefined,
            )
            .addResponse(result);

        return result;
    }

    private async captureScreenshot(sessionId: string): Promise<string | null> {
        try {
            const validatedInput = captureScreenshotInputSchema.parse({ sessionId });

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
        recordBuilder: ProtocolRecordBuilder,
        options?: ResultOptions,
    ): Promise<CallToolResult> {
        const resultBuilder = this.resultBuilderFactory.create();
        resultBuilder.addText(text);

        if (options?.sessionId && options?.includeScreenshot) {
            const screenshot = await this.captureScreenshot(options.sessionId);
            if (screenshot) {
                resultBuilder.addScreenshot(screenshot);

                const screenshotPath = await this.screenshotService.saveScreenshot(screenshot);
                recordBuilder.addScreenshot(screenshotPath);
            }
        }

        const record = recordBuilder.build();
        await this.protocolService.addRecord(record);

        return resultBuilder.build();
    }

    async createSession(
        url: string,
        formatResult: (result: CreateSessionResponse) => string,
        options?: ResultOptions,
    ): Promise<CallToolResult> {
        const recordBuilder = this.recordBuilderFactory.create();

        const validatedInput = createSessionInputSchema.parse({ url });

        const data = await this.apiRequestJson(
            { path: "/api/sessions" },
            {
                method: "POST",
                body: JSON.stringify(validatedInput),
            },
            recordBuilder,
        );

        const result = createSessionResponseSchema.parse(data);
        const text = formatResult(result);

        return this.buildResult(text, recordBuilder, {
            sessionId: result.payload.id,
            includeScreenshot: options?.includeScreenshot,
        });
    }

    async deleteSession(
        sessionId: string,
        formatResult: (result: DeleteSessionResponse) => string,
    ): Promise<CallToolResult> {
        const recordBuilder = this.recordBuilderFactory.create();

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

        const result = deleteSessionResponseSchema.parse(data);
        const text = formatResult(result);

        return this.buildResult(text, recordBuilder);
    }

    async performAction(
        sessionId: string,
        action: Action,
        formatResult: (result: PerformActionResponse) => string,
        options?: ResultOptions,
    ): Promise<CallToolResult> {
        const recordBuilder = this.recordBuilderFactory.create();

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

        const result = performActionResponseSchema.parse(data);
        const text = formatResult(result);

        return this.buildResult(text, recordBuilder, {
            sessionId,
            includeScreenshot: options?.includeScreenshot,
        });
    }
}
