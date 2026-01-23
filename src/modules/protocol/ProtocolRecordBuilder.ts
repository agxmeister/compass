import type { Endpoint } from "@/modules/browser/index.js";
import type { ProtocolRecord } from "./types.js";

export class ProtocolRecordBuilder {
    private endpoint?: Endpoint;
    private data?: Record<string, unknown>;
    private result?: Record<string, unknown>;
    private screenshotPath?: string;

    addRequest(endpoint: Endpoint, data?: Record<string, unknown>): this {
        this.endpoint = endpoint;
        this.data = data;
        return this;
    }

    addResponse(result: Record<string, unknown>): this {
        this.result = result;
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

        if (!this.result) {
            throw new Error("Cannot build protocol record without response result");
        }

        const result = this.screenshotPath
            ? { ...this.result, screenshot: this.screenshotPath }
            : this.result;

        return {
            timestamp: new Date().toISOString(),
            type: "axis-api-call",
            payload: {
                endpoint: this.endpoint,
                data: this.data,
            },
            result,
        };
    }
}
