import { z as zod } from "zod";
import type { HttpEndpoint } from "@/modules/http/types.js";
import type { ProtocolRecordBuilder } from "@/modules/journey/types.js";

export interface CaptureScreenshotResponse {
    path: string;
    body: string;
}

export interface Driver {
    act<T extends Record<string, unknown>>(endpoint: HttpEndpoint, schema: zod.ZodType<T>, body?: Record<string, unknown>): Promise<T>;
    observe(endpoint: HttpEndpoint, type: string): Promise<CaptureScreenshotResponse>;
}

export interface DriverFactory {
    create(protocolRecordBuilder: ProtocolRecordBuilder): Driver;
}
