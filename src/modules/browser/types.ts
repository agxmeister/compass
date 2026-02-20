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
import type { ProtocolRecordBuilder } from "@/modules/protocol/types.js";

export type CreateSessionInput = zod.infer<typeof createSessionInputSchema>;
export type DeleteSessionInput = zod.infer<typeof deleteSessionInputSchema>;
export type Action = zod.infer<typeof actionSchema>;
export type PerformActionInput = zod.infer<typeof performActionInputSchema>;

export type CreateSessionResponse = zod.infer<typeof createSessionResponseSchema>;
export type DeleteSessionResponse = zod.infer<typeof deleteSessionResponseSchema>;
export type PerformActionResponse = zod.infer<typeof performActionResponseSchema>;
export type CaptureScreenshotResponse = zod.infer<typeof captureScreenshotResponseSchema>;

export type { ProtocolRecordBuilder };

export interface BrowserService {
    createSession(url: string): Promise<CreateSessionResponse>;
    deleteSession(sessionId: string): Promise<DeleteSessionResponse>;
    performAction(sessionId: string, action: Action): Promise<PerformActionResponse>;
    captureScreenshot(sessionId: string): Promise<CaptureScreenshotResponse>;
}

export interface BrowserServiceFactory {
    create(protocolRecordBuilder: ProtocolRecordBuilder): BrowserService;
}
