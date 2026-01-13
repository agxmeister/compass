import { injectable, inject } from "inversify";
import { ProtocolRepository } from "./ProtocolRepository.js";
import { ProtocolRecord } from "./types.js";
import { dependencies } from "../../dependencies.js";

@injectable()
export class ProtocolService {
    constructor(
        @inject(dependencies.ProtocolRepository) private readonly repository: ProtocolRepository,
        @inject(dependencies.ProtocolName) private readonly protocolId: string,
    ) {}

    async addRecord(record: ProtocolRecord): Promise<void> {
        await this.repository.addRecord(this.protocolId, record);
    }
}
