import { z as zod } from "zod";
import { protocolRecordSchema, protocolSchema } from "./schemas.js";
import type { HttpEndpoint } from "@/modules/http/types.js";
import type { Binary } from "@/modules/binary/index.js";

export type ProtocolRecord = zod.infer<typeof protocolRecordSchema>;
export type Protocol = zod.infer<typeof protocolSchema>;

export type { HttpEndpoint };

export interface ProtocolRecordBuilder {
    setType(type: string): this;
    setHttpRequest(endpoint: HttpEndpoint, input?: Record<string, unknown>): this;
    setHttpResponse(status: number, output: Record<string, unknown>): this;
    addBinary(binary: Binary): this;
}

export interface ProtocolService {
    addRecord(record: ProtocolRecord): Promise<void>;
}

