import { z as zod } from "zod";

export const actionSchema = zod.discriminatedUnion("type", [
    zod.object({
        type: zod.literal("click"),
        x: zod.number(),
        y: zod.number(),
    }),
    zod.object({
        type: zod.literal("navigate"),
        url: zod.string(),
    }),
]);

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

export const createSessionPayloadSchema = zod.object({
    id: zod.string(),
    createDate: zod.string(),
});

export const deletedSessionPayloadSchema = zod.object({
    id: zod.string(),
});

export const performActionPayloadSchema = zod.discriminatedUnion("type", [
    zod.object({
        type: zod.literal("click"),
        x: zod.number(),
        y: zod.number(),
    }),
    zod.object({
        type: zod.literal("navigate"),
        url: zod.string(),
    }),
]);

export const apiResponseSchema = <T extends zod.ZodTypeAny>(payloadSchema: T) =>
    zod.object({
        payload: payloadSchema,
    });

export const createSessionResponseSchema = apiResponseSchema(createSessionPayloadSchema);
export const deleteSessionResponseSchema = apiResponseSchema(deletedSessionPayloadSchema);
export const performActionResponseSchema = apiResponseSchema(performActionPayloadSchema);
