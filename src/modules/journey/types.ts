import type { HttpEndpoint } from "@/modules/http/types.js";
import type { Binary } from "@/modules/binary/index.js";

export type ProtocolRecord<T extends Record<string, unknown> = Record<string, unknown>> = {
    timestamp: string;
    type: string;
    binaries?: Array<{ path: string; type: string }>;
} & T;

export type Protocol = {
    journey: string;
    records: ProtocolRecord[];
};

export type { HttpEndpoint };

export interface ProtocolRecordBuilder {
    setType(type: string): this;
    addBinary(binary: Binary): this;
    build(): ProtocolRecord;
}

export interface ProtocolRepository {
    load(): Promise<Protocol>;
    save(protocol: Protocol): Promise<void>;
    addRecord(record: ProtocolRecord): Promise<void>;
}

export interface ProtocolService {
    addRecord(record: ProtocolRecord): Promise<void>;
}
