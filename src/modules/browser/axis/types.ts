import { z as zod } from "zod";
import {
    actionSchema,
    createSessionInputSchema,
    deleteSessionInputSchema,
    performActionInputSchema,
    createSessionPayloadSchema,
    deletedSessionPayloadSchema,
    performActionPayloadSchema,
    createSessionResponseSchema,
    deleteSessionResponseSchema,
    performActionResponseSchema,
} from "./schemas.js";

export type CreateSessionInput = zod.infer<typeof createSessionInputSchema>;
export type DeleteSessionInput = zod.infer<typeof deleteSessionInputSchema>;
export type PerformActionInput = zod.infer<typeof performActionInputSchema>;

export type Action = zod.infer<typeof actionSchema>;

export type CreateSessionPayload = zod.infer<typeof createSessionPayloadSchema>;
export type DeletedSessionPayload = zod.infer<typeof deletedSessionPayloadSchema>;
export type PerformActionPayload = zod.infer<typeof performActionPayloadSchema>;

export type CreateSessionResponse = zod.infer<typeof createSessionResponseSchema>;
export type DeleteSessionResponse = zod.infer<typeof deleteSessionResponseSchema>;
export type PerformActionResponse = zod.infer<typeof performActionResponseSchema>;
