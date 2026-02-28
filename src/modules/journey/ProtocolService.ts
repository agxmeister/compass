import { injectable, inject } from "inversify";
import { ProtocolRepository } from "./ProtocolRepository.js";
import { ProtocolRecord, ProtocolService as ProtocolServiceInterface } from "./types.js";
import { dependencies } from "@/dependencies.js";

@injectable()
export class ProtocolService implements ProtocolServiceInterface {
    constructor(
        @inject(dependencies.ProtocolRepository) private readonly repository: ProtocolRepository,
    ) {}

    async addRecord(record: ProtocolRecord): Promise<void> {
        await this.repository.addRecord(record);
    }
}
