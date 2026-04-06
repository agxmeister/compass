import type { HttpEndpoint } from "../types.js";
import type { HttpProtocolRecord, HttpProtocolRecordBuilder as HttpProtocolRecordBuilderInterface } from "./types.js";
import type { Binary, BinaryServiceInterface } from "@/modules/binary/index.js";

export class HttpProtocolRecordBuilder implements HttpProtocolRecordBuilderInterface {
    private type?: string;
    private endpoint?: HttpEndpoint;
    private input?: Record<string, unknown>;
    private status?: number;
    private output?: Record<string, unknown>;
    private binaries: Binary[] = [];

    constructor(
        private readonly binaryService: BinaryServiceInterface,
    ) {}

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

    addBinary(binary: Binary): this {
        this.binaries.push(binary);
        return this;
    }

    build(): HttpProtocolRecord {
        if (this.type === undefined) {
            throw new Error("Cannot build protocol record without type");
        }

        if (this.endpoint === undefined) {
            throw new Error("Cannot build protocol record without request endpoint");
        }

        if (this.status === undefined) {
            throw new Error("Cannot build protocol record without response status");
        }

        if (this.output === undefined) {
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
            ...(this.binaries.length > 0 && {
                binaries: this.binaries.map((binary) => ({
                    path: this.binaryService.getPath(binary),
                    type: binary.mimeType,
                })),
            }),
        };
    }
}
