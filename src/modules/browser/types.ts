import { z as zod } from "zod";
import { actionSchema } from "./schemas.js";
import type { ProtocolRecordBuilder } from "@/modules/journey/types.js";

export type { ProtocolRecordBuilder };

export type Action = zod.infer<typeof actionSchema>;

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
