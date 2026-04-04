import type { HttpProtocolRecordBuilder } from "@/modules/journey/http/types.js";

export type { HttpProtocolRecordBuilder };

export type CreateSessionResult<T extends Record<string, unknown>> = { sessionId: string, payload: T };
export type DeleteSessionResult<T extends Record<string, unknown>> = { payload: T };
export type PerformActionResult<T extends Record<string, unknown>> = { payload: T };

export interface BrowserService<
    CreateSessionPayload extends Record<string, unknown>,
    DeleteSessionPayload extends Record<string, unknown>,
    PerformActionPayload extends Record<string, unknown>,
    Action
> {
    createSession(url: string): Promise<CreateSessionResult<CreateSessionPayload>>;
    deleteSession(sessionId: string): Promise<DeleteSessionResult<DeleteSessionPayload>>;
    performAction(sessionId: string, action: Action): Promise<PerformActionResult<PerformActionPayload>>;
    captureScreenshot(sessionId: string): Promise<string>;
}

export interface BrowserServiceFactory<
    CreateSessionPayload extends Record<string, unknown>,
    DeleteSessionPayload extends Record<string, unknown>,
    PerformActionPayload extends Record<string, unknown>,
    Action
> {
    create(protocolRecordBuilder: HttpProtocolRecordBuilder): BrowserService<
        CreateSessionPayload,
        DeleteSessionPayload,
        PerformActionPayload,
        Action
    >;
}
