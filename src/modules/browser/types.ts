import type { ProtocolRecordBuilder } from "@/modules/journey/types.js";

export type { ProtocolRecordBuilder };

export interface CreateSessionResult<T extends Record<string, unknown>> {
    sessionId: string;
    data: T;
}

export interface BrowserService<
    CreateSessionResponse extends Record<string, unknown>,
    DeleteSessionResponse extends Record<string, unknown>,
    PerformActionResponse extends Record<string, unknown>,
    Action
> {
    createSession(url: string): Promise<CreateSessionResult<CreateSessionResponse>>;
    deleteSession(sessionId: string): Promise<DeleteSessionResponse>;
    performAction(sessionId: string, action: Action): Promise<PerformActionResponse>;
    captureScreenshot(sessionId: string): Promise<string>;
}

export interface BrowserServiceFactory<
    CreateSessionResponse extends Record<string, unknown>,
    DeleteSessionResponse extends Record<string, unknown>,
    PerformActionResponse extends Record<string, unknown>,
    Action
> {
    create(protocolRecordBuilder: ProtocolRecordBuilder): BrowserService<CreateSessionResponse, DeleteSessionResponse, PerformActionResponse, Action>;
}
