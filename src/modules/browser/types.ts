import { z as zod } from "zod";
import {
    createSessionInputSchema,
    deleteSessionInputSchema,
    actionSchema,
    performActionInputSchema,
    createSessionResponseSchema,
    deleteSessionResponseSchema,
    performActionResponseSchema,
    captureScreenshotResponseSchema,
} from "./schemas.js";
import type { HttpEndpoint } from "@/modules/http/types.js";
import type { ProtocolRecordBuilder } from "@/modules/protocol/types.js";

export type CreateSessionInput = zod.infer<typeof createSessionInputSchema>;
export type DeleteSessionInput = zod.infer<typeof deleteSessionInputSchema>;
export type Action = zod.infer<typeof actionSchema>;
export type PerformActionInput = zod.infer<typeof performActionInputSchema>;

export type CreateSessionResponse = zod.infer<typeof createSessionResponseSchema>;
export type DeleteSessionResponse = zod.infer<typeof deleteSessionResponseSchema>;
export type PerformActionResponse = zod.infer<typeof performActionResponseSchema>;
export type CaptureScreenshotResponse = zod.infer<typeof captureScreenshotResponseSchema>;

export type { HttpEndpoint, ProtocolRecordBuilder };

export interface BrowserDriver {
    act<T extends Record<string, unknown>>(endpoint: HttpEndpoint, schema: zod.ZodType<T>, body?: Record<string, unknown>): Promise<T>;
    observe(endpoint: HttpEndpoint, type: string): Promise<CaptureScreenshotResponse>;
}

export interface BrowserDriverFactory {
    create(protocolRecordBuilder: ProtocolRecordBuilder): BrowserDriver;
}

export interface BrowserService {
    createSession(url: string): Promise<CreateSessionResponse>;
    deleteSession(sessionId: string): Promise<DeleteSessionResponse>;
    performAction(sessionId: string, action: Action): Promise<PerformActionResponse>;
    captureScreenshot(sessionId: string): Promise<CaptureScreenshotResponse>;
}

export interface BrowserServiceFactory {
    create(protocolRecordBuilder: ProtocolRecordBuilder): BrowserService;
}
