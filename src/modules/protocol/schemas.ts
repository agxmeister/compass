import { z as zod } from "zod";

export const protocolRecordSchema = zod.object({
    timestamp: zod.string(),
    type: zod.literal("axis-api-call"),
    payload: zod.object({
        endpoint: zod.object({
            path: zod.string(),
            parameters: zod.record(zod.any()).optional(),
        }),
        data: zod.any().optional(),
    }),
    result: zod.any(),
});

export const protocolSchema = zod.object({
    protocolId: zod.string(),
    records: zod.array(protocolRecordSchema),
});
