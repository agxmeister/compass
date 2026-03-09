import { z as zod } from "zod";
import {
    createSessionInputSchema,
    deleteSessionInputSchema,
    actionSchema,
    performActionInputSchema,
    createSessionResponseSchema,
    deleteSessionResponseSchema,
    performActionResponseSchema,
} from "./schemas.js";
import type { ProtocolRecordBuilder } from "@/modules/journey/types.js";

export type CreateSessionInput = zod.infer<typeof createSessionInputSchema>;
export type DeleteSessionInput = zod.infer<typeof deleteSessionInputSchema>;
export type Action = zod.infer<typeof actionSchema>;
export type PerformActionInput = zod.infer<typeof performActionInputSchema>;

export type CreateSessionResponse = zod.infer<typeof createSessionResponseSchema>;
export type DeleteSessionResponse = zod.infer<typeof deleteSessionResponseSchema>;
export type PerformActionResponse = zod.infer<typeof performActionResponseSchema>;

export type { ProtocolRecordBuilder };

export interface BrowserService<
    CreateResult extends Record<string, unknown>,
    DeleteResult extends Record<string, unknown>,
    ActionResult extends Record<string, unknown>
> {
    createSession(url: string): Promise<CreateResult>;
    deleteSession(sessionId: string): Promise<DeleteResult>;
    performAction(sessionId: string, action: Action): Promise<ActionResult>;
    captureScreenshot(sessionId: string): Promise<string>;
}

export interface BrowserServiceFactory<
    CreateResult extends Record<string, unknown>,
    DeleteResult extends Record<string, unknown>,
    ActionResult extends Record<string, unknown>
> {
    create(protocolRecordBuilder: ProtocolRecordBuilder): BrowserService<CreateResult, DeleteResult, ActionResult>;
}
