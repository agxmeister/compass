import type {
    HttpEndpoint,
    ProtocolRecord,
    ProtocolRecordBuilder as ProtocolRecordBuilderInterface,
} from "./types.js";

export class ProtocolRecordBuilder implements ProtocolRecordBuilderInterface {
    private type?: string;
    private endpoint?: HttpEndpoint;
    private input?: Record<string, unknown>;
    private status?: number;
    private output?: Record<string, unknown>;
    private binaries: Array<{ path: string; type: string }> = [];

    setType(type: string): this {
        this.type = type;
        return this;
    }

    setHttpRequest(endpoint: HttpEndpoint, input?: Record<string, unknown>): this {
        this.endpoint = endpoint;
        this.input = input;
        return this;
    }

    setHttpResponse(status: number, output: Record<string, unknown>): this {
        this.status = status;
        this.output = output;
        return this;
    }

    addBinary(path: string, type: string): this {
        this.binaries.push({ path, type });
        return this;
    }

    build(): ProtocolRecord {
        if (!this.type) {
            throw new Error("Cannot build protocol record without type");
        }

        if (!this.endpoint) {
            throw new Error("Cannot build protocol record without request endpoint");
        }

        if (!this.status) {
            throw new Error("Cannot build protocol record without response status");
        }

        if (!this.output) {
            throw new Error("Cannot build protocol record without response output");
        }

        return {
            timestamp: new Date().toISOString(),
            type: this.type,
            request: {
                endpoint: this.endpoint,
                body: this.input,
            },
            response: {
                status: this.status,
                body: this.output,
            },
            ...(this.binaries.length > 0 && { binaries: this.binaries }),
        };
    }
}
