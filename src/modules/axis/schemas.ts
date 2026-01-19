import { z as zod } from "zod";

export const createSessionInputSchema = zod.object({
    url: zod.string(),
});

export const deleteSessionInputSchema = zod.object({
    sessionId: zod.string(),
});

export const captureScreenshotInputSchema = zod.object({
    sessionId: zod.string(),
});

export const actionSchema = zod.discriminatedUnion("type", [
    zod.object({
        type: zod.literal("click"),
        x: zod.number(),
        y: zod.number(),
    }),
    zod.object({
        type: zod.literal("open-page"),
        url: zod.string(),
    }),
]);

export const performActionInputSchema = zod.object({
    sessionId: zod.string(),
    action: actionSchema,
});

export const sessionPayloadSchema = zod.object({
    id: zod.string(),
    createDate: zod.string(),
});

export const apiResponseSchema = <T extends zod.ZodTypeAny>(payloadSchema: T) =>
    zod.object({
        payload: payloadSchema,
        message: zod.string().optional(),
    });

export const createSessionResponseSchema = apiResponseSchema(sessionPayloadSchema);
export const deleteSessionResponseSchema = apiResponseSchema(sessionPayloadSchema);
export const performActionResponseSchema = apiResponseSchema(zod.any());
