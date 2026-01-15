import { injectable } from 'inversify';
import type { ProtocolRecord } from "./types.js";

type Endpoint = {
    path: string;
    parameters?: Record<string, any>;
};

@injectable()
export class ProtocolRecordBuilder {
    private endpoint?: Endpoint;
    private data?: any;
    private result?: any;
    private screenshotPath?: string;

    reset(): this {
        this.endpoint = undefined;
        this.data = undefined;
        this.result = undefined;
        this.screenshotPath = undefined;
        return this;
    }

    addRequest(endpoint: Endpoint, data?: any): this {
        this.endpoint = endpoint;
        this.data = data;
        return this;
    }

    addResponse(result: any): this {
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
