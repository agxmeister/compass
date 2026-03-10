import { z as zod } from "zod";
import { actionSchema } from "../schemas.js";

export const createSessionInputSchema = zod.object({
    url: zod.string(),
});

export const deleteSessionInputSchema = zod.object({
    sessionId: zod.string(),
});

export const captureScreenshotInputSchema = zod.object({
    sessionId: zod.string(),
});

export const performActionInputSchema = zod.object({
    sessionId: zod.string(),
    action: actionSchema,
});

export const sessionPayloadSchema = zod.object({
    id: zod.string(),
    createDate: zod.string(),
});

export const deletedSessionPayloadSchema = zod.object({
    id: zod.string(),
});

export const apiResponseSchema = <T extends zod.ZodTypeAny>(payloadSchema: T) =>
    zod.object({
        payload: payloadSchema,
    });

export const createSessionResponseSchema = apiResponseSchema(sessionPayloadSchema);
export const deleteSessionResponseSchema = apiResponseSchema(deletedSessionPayloadSchema);
export const performActionResponseSchema = apiResponseSchema(zod.any());
