import { z as zod } from "zod";
import { protocolRecordSchema, protocolSchema } from "./schemas.js";

export type ProtocolRecord = zod.infer<typeof protocolRecordSchema>;
export type Protocol = zod.infer<typeof protocolSchema>;
