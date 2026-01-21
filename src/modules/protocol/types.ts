import { z as zod } from "zod";
import { protocolRecordSchema, protocolSchema } from "./schemas.js";

export type ProtocolRecord = zod.infer<typeof protocolRecordSchema>;
export type Protocol = zod.infer<typeof protocolSchema>;

export interface ProtocolService {
    addRecord(record: ProtocolRecord): Promise<void>;
}

export interface ScreenshotService {
    saveScreenshot(base64Data: string): Promise<string>;
}
