import { injectable, inject } from "inversify";
import { promises as fs } from "fs";
import path from "path";
import { Protocol, ProtocolRecord } from "./types.js";
import { protocolSchema } from "./schemas.js";
import { dependencies } from "../../dependencies.js";

@injectable()
export class ProtocolRepository {
    constructor(
        @inject(dependencies.ProtocolDir) private readonly dataDir: string,
    ) {}

    private getFilePath(protocolId: string): string {
        return path.join(this.dataDir, `${protocolId}.json`);
    }

    async load(protocolId: string): Promise<Protocol> {
        const filePath = this.getFilePath(protocolId);

        try {
            const content = await fs.readFile(filePath, "utf-8");
            const data = JSON.parse(content);
            return protocolSchema.parse(data);
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === "ENOENT") {
                // File doesn't exist, create a new protocol
                const newProtocol: Protocol = {
                    protocolId,
                    records: [],
                };
                await this.save(newProtocol);
                return newProtocol;
            }
            throw error;
        }
    }

    async save(protocol: Protocol): Promise<void> {
        await fs.mkdir(this.dataDir, { recursive: true });
        const filePath = this.getFilePath(protocol.protocolId);
        const content = JSON.stringify(protocol, null, 4);
        await fs.writeFile(filePath, content, "utf-8");
    }

    async addRecord(protocolId: string, record: ProtocolRecord): Promise<void> {
        const protocol = await this.load(protocolId);
        protocol.records.push(record);
        await this.save(protocol);
    }
}
