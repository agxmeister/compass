import { z as zod } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ResultOptions } from "@/modules/mcp/index.js";
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
    createSession(
        url: string,
        formatResult: (result: CreateSessionResponse) => string,
        options?: ResultOptions,
    ): Promise<CallToolResult>;

    deleteSession(
        sessionId: string,
        formatResult: (result: DeleteSessionResponse) => string,
    ): Promise<CallToolResult>;

    performAction(
        sessionId: string,
        action: Action,
        formatResult: (result: PerformActionResponse) => string,
        options?: ResultOptions,
    ): Promise<CallToolResult>;
}
