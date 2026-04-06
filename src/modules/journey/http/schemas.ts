import { z as zod } from "zod";
import { protocolRecordSchema } from "../schemas.js";

export const httpPayloadSchema = zod.object({
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
});

export const httpProtocolRecordSchema = protocolRecordSchema.extend(httpPayloadSchema.shape);
