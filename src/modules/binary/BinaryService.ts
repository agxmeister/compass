import { injectable, inject } from "inversify";
import { format } from "date-fns";
import { dependencies } from "@/dependencies.js";
import { BinaryRepository } from "./BinaryRepository.js";
import type { Binary, BinaryService as BinaryServiceInterface } from "./types.js";

@injectable()
export class BinaryService implements BinaryServiceInterface {
    constructor(
        @inject(dependencies.BinaryRepository) private readonly repository: BinaryRepository,
    ) {}

    async saveScreenshot(base64Data: string): Promise<Binary> {
        const timestamp = format(new Date(), "yyyy-MM-dd-HH-mm-ss");
        const filename = await this.resolveFilename(`screenshot-${timestamp}`, "png");
        const buffer = Buffer.from(base64Data, "base64");
        await this.repository.save(filename, buffer);
        return { filename, mimeType: "image/png" };
    }

    private async resolveFilename(name: string, extension: string): Promise<string> {
        const base = `${name}.${extension}`;
        if (!await this.repository.exists(base)) {
            return base;
        }
        let suffix = 1;
        while (await this.repository.exists(`${name}-${suffix}.${extension}`)) {
            suffix++;
        }
        return `${name}-${suffix}.${extension}`;
    }

    async getScreenshotContent(binary: Binary): Promise<string> {
        const buffer = await this.repository.getContent(binary.filename);
        return buffer.toString("base64");
    }

    getPath(binary: Binary): string {
        return this.repository.getPath(binary.filename);
    }
}
