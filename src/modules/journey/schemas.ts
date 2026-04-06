import { z as zod } from "zod";

export const protocolRecordSchema = zod.object({
    timestamp: zod.string(),
    type: zod.string(),
    binaries: zod.array(zod.object({
        path: zod.string(),
        type: zod.string(),
    })).optional(),
}).passthrough();

export const protocolSchema = zod.object({
    journey: zod.string(),
    records: zod.array(protocolRecordSchema),
});
