import type {
    HttpEndpoint,
    ProtocolRecord,
    ProtocolRecordBuilder as ProtocolRecordBuilderInterface,
} from "./types.js";

export class ProtocolRecordBuilder implements ProtocolRecordBuilderInterface {
    private endpoint?: HttpEndpoint;
    private input?: Record<string, unknown>;
    private output?: Record<string, unknown>;
    private screenshotPath?: string;

    addHttpRequest(endpoint: HttpEndpoint, input?: Record<string, unknown>): this {
        this.endpoint = endpoint;
        this.input = input;
        return this;
    }

    addHttpResponse(output: Record<string, unknown>): this {
        this.output = output;
        return this;
    }

    addScreenshot(path: string): this {
        this.screenshotPath = path;
        return this;
    }

    build(): ProtocolRecord {
        if (!this.endpoint) {
            throw new Error("Cannot build protocol record without request endpoint");
        }

        if (!this.output) {
            throw new Error("Cannot build protocol record without response output");
        }

        const result = this.screenshotPath
            ? { ...this.output, screenshot: this.screenshotPath }
            : this.output;

        return {
            timestamp: new Date().toISOString(),
            type: "axis-api-call",
            payload: {
                endpoint: this.endpoint,
                data: this.input,
            },
            result,
        };
    }
}
