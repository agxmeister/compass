import { z as zod } from "zod";
import type { ProtocolRecordBuilder, ProtocolRecord, HttpEndpoint } from "../types.js";
import { httpPayloadSchema } from "./schemas.js";

export type HttpPayload = zod.infer<typeof httpPayloadSchema>;

export type HttpProtocolRecord = ProtocolRecord<HttpPayload>;

export interface HttpProtocolRecordBuilder extends ProtocolRecordBuilder {
    setHttpRequest(endpoint: HttpEndpoint, input?: Record<string, unknown>): this;
    setHttpResponse(status: number, output: Record<string, unknown>): this;
    build(): HttpProtocolRecord;
}
