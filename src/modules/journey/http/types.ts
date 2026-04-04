import type { ProtocolRecordBuilder, HttpEndpoint } from "../types.js";

export interface HttpProtocolRecordBuilder extends ProtocolRecordBuilder {
    setHttpRequest(endpoint: HttpEndpoint, input?: Record<string, unknown>): this;
    setHttpResponse(status: number, output: Record<string, unknown>): this;
}
