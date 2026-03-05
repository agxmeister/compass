import { z as zod } from "zod";
import type { ProtocolRecordBuilder } from "@/modules/journey/types.js";

export interface Driver<Command> {
    act<T extends Record<string, unknown>>(command: Command, schema: zod.ZodType<T>): Promise<T>;
    observe<T>(command: Command, handler: (data: Buffer) => Promise<T>): Promise<T>;
}

export interface DriverFactory<Command> {
    create(protocolRecordBuilder: ProtocolRecordBuilder): Driver<Command>;
}
