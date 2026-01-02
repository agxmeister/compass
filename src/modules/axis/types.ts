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

// Inferred input types
export type CreateSessionInput = zod.infer<typeof createSessionInputSchema>;
export type DeleteSessionInput = zod.infer<typeof deleteSessionInputSchema>;
export type Action = zod.infer<typeof actionSchema>;
export type PerformActionInput = zod.infer<typeof performActionInputSchema>;

// Inferred response types
export type CreateSessionResponse = zod.infer<typeof createSessionResponseSchema>;
export type DeleteSessionResponse = zod.infer<typeof deleteSessionResponseSchema>;
export type PerformActionResponse = zod.infer<typeof performActionResponseSchema>;
