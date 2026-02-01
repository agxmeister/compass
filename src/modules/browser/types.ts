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

export type CreateSessionInput = zod.infer<typeof createSessionInputSchema>;
export type DeleteSessionInput = zod.infer<typeof deleteSessionInputSchema>;
export type Action = zod.infer<typeof actionSchema>;
export type PerformActionInput = zod.infer<typeof performActionInputSchema>;

export type CreateSessionResponse = zod.infer<typeof createSessionResponseSchema>;
export type DeleteSessionResponse = zod.infer<typeof deleteSessionResponseSchema>;
export type PerformActionResponse = zod.infer<typeof performActionResponseSchema>;

export type Endpoint = {
    path: string;
    parameters?: Record<string, any>;
};

export interface BrowserService {
    createSession(url: string): Promise<CreateSessionResponse>;
    deleteSession(sessionId: string): Promise<DeleteSessionResponse>;
    performAction(sessionId: string, action: Action): Promise<PerformActionResponse>;
    captureScreenshot(sessionId: string): Promise<string | null>;
}

export type Result<T> = {
    payload: T;
    screenshot: string | null;
};

export interface BrowserSessionServiceInterface {
    createSession(url: string, captureScreenshot?: boolean): Promise<Result<CreateSessionResponse>>;
    deleteSession(sessionId: string): Promise<Result<DeleteSessionResponse>>;
}

export interface BrowserActionServiceInterface {
    performAction(sessionId: string, action: Action, captureScreenshot?: boolean): Promise<Result<PerformActionResponse>>;
}
