import { z as zod } from "zod";
import type { ProtocolRecordBuilder } from "@/modules/journey/types.js";
import type { Binary } from "@/modules/binary/index.js";

export interface Driver<Command> {
    act<T extends Record<string, unknown>>(command: Command, schema: zod.ZodType<T>): Promise<T>;
    observe(command: Command): Promise<Binary>;
}

export interface DriverFactory<Command> {
    create(protocolRecordBuilder: ProtocolRecordBuilder): Driver<Command>;
}
