import { injectable, inject } from "inversify";
import { promises as fs } from "fs";
import path from "path";
import { dependencies } from "@/dependencies.js";

@injectable()
export class BinaryRepository {
    constructor(
        @inject(dependencies.JourneyDir) private readonly journeyDir: string,
    ) {}

    private getBaseDir(): string {
        return path.join(this.journeyDir, "binaries");
    }

    async save(filename: string, data: Buffer): Promise<string> {
        const binariesDir = this.getBaseDir();
        await fs.mkdir(binariesDir, { recursive: true });

        const filePath = path.join(binariesDir, filename);
        await fs.writeFile(filePath, data);

        return filename;
    }

    getPath(filename: string): string {
        return path.join(this.getBaseDir(), filename);
    }

    async exists(filename: string): Promise<boolean> {
        try {
            await fs.access(this.getPath(filename));
            return true;
        } catch {
            return false;
        }
    }

    async getContent(filename: string): Promise<Buffer> {
        return fs.readFile(this.getPath(filename));
    }
}
