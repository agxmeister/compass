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
        const filename = `screenshot-${timestamp}.png`;
        const buffer = Buffer.from(base64Data, "base64");
        await this.repository.save(filename, buffer);
        return { filename, mimeType: "image/png" };
    }

    async getScreenshotContent(binary: Binary): Promise<string> {
        const buffer = await this.repository.getContent(binary.filename);
        return buffer.toString("base64");
    }

    getPath(binary: Binary): string {
        return this.repository.getPath(binary.filename);
    }
}
