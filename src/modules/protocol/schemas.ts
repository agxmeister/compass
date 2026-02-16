import { z as zod } from "zod";

export const protocolRecordSchema = zod.object({
    timestamp: zod.string(),
    type: zod.literal("axis-api-call"),
    request: zod.object({
        endpoint: zod.object({
            method: zod.string(),
            path: zod.string(),
            parameters: zod.record(zod.unknown()).optional(),
        }),
        body: zod.record(zod.unknown()).optional(),
    }),
    response: zod.object({
        status: zod.number(),
        body: zod.record(zod.unknown()),
    }),
    screenshot: zod.string().optional(),
});

export const protocolSchema = zod.object({
    journey: zod.string(),
    records: zod.array(protocolRecordSchema),
});
