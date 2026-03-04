import { z as zod } from "zod";
import type { ProtocolRecordBuilder } from "@/modules/journey/types.js";

export interface CaptureScreenshotResponse {
    path: string;
    body: string;
}

export interface Driver<Command> {
    act<T extends Record<string, unknown>>(command: Command, schema: zod.ZodType<T>): Promise<T>;
    observe(command: Command, type: string): Promise<CaptureScreenshotResponse>;
}

export interface DriverFactory<Command> {
    create(protocolRecordBuilder: ProtocolRecordBuilder): Driver<Command>;
}
