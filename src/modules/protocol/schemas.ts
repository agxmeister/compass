import { z as zod } from "zod";

export const protocolRecordSchema = zod.object({
    timestamp: zod.string(),
    type: zod.literal("axis-api-call"),
    payload: zod.object({
        endpoint: zod.object({
            method: zod.string(),
            path: zod.string(),
            parameters: zod.record(zod.unknown()).optional(),
        }),
        data: zod.record(zod.unknown()).optional(),
    }),
    result: zod.record(zod.unknown()),
});

export const protocolSchema = zod.object({
    protocolId: zod.string(),
    records: zod.array(protocolRecordSchema),
});
