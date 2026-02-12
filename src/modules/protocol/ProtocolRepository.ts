import { injectable, inject } from "inversify";
import { promises as fs } from "fs";
import path from "path";
import { Protocol, ProtocolRecord } from "./types.js";
import { protocolSchema } from "./schemas.js";
import { dependencies } from "../../dependencies.js";

@injectable()
export class ProtocolRepository {
    private writeQueue: Promise<void> = Promise.resolve();

    constructor(
        @inject(dependencies.JourneyDir) private readonly journeyDir: string,
    ) {}

    private getFilePath(): string {
        return path.join(this.journeyDir, "protocol.json");
    }

    async load(): Promise<Protocol> {
        const filePath = this.getFilePath();

        try {
            const content = await fs.readFile(filePath, "utf-8");
            const data = JSON.parse(content);
            return protocolSchema.parse(data);
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === "ENOENT") {
                const journeyName = path.basename(this.journeyDir);
                const newProtocol: Protocol = {
                    protocolId: journeyName,
                    records: [],
                };
                await this.save(newProtocol);
                return newProtocol;
            }
            throw error;
        }
    }

    async save(protocol: Protocol): Promise<void> {
        await fs.mkdir(this.journeyDir, { recursive: true });
        const filePath = this.getFilePath();
        const content = JSON.stringify(protocol, null, 4);
        await fs.writeFile(filePath, content, "utf-8");
    }

    async addRecord(record: ProtocolRecord): Promise<void> {
        await (this.writeQueue = this.writeQueue.then(async () => {
            const protocol = await this.load();
            protocol.records.push(record);
            await this.save(protocol);
        }));
    }
}
