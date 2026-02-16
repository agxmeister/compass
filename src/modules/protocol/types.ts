import { z as zod } from "zod";
import { protocolRecordSchema, protocolSchema } from "./schemas.js";
import type { HttpEndpoint } from "@/modules/http/types.js";

export type ProtocolRecord = zod.infer<typeof protocolRecordSchema>;
export type Protocol = zod.infer<typeof protocolSchema>;

export type { HttpEndpoint };

export interface ProtocolRecordBuilder {
    addHttpRequest(endpoint: HttpEndpoint, input?: Record<string, unknown>): this;
    addHttpResponse(status: number, output: Record<string, unknown>): this;
    addScreenshot(path: string): this;
}

export interface ProtocolService {
    addRecord(record: ProtocolRecord): Promise<void>;
}

export interface ScreenshotService {
    saveScreenshot(base64Data: string): Promise<string>;
}
