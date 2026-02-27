import { injectable, inject } from "inversify";
import { promises as fs } from "fs";
import path from "path";
import { dependencies } from "@/dependencies.js";

@injectable()
export class BinaryRepository {
    constructor(
        @inject(dependencies.JourneyDir) private readonly journeyDir: string,
    ) {}

    private getBinariesDir(): string {
        return path.join(this.journeyDir, "binaries");
    }

    async save(filename: string, data: Buffer): Promise<string> {
        const binariesDir = this.getBinariesDir();
        await fs.mkdir(binariesDir, { recursive: true });

        const filePath = path.join(binariesDir, filename);
        await fs.writeFile(filePath, data);

        return filePath;
    }
}
