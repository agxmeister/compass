import { injectable, inject } from "inversify";
import { dependencies } from "@/dependencies.js";
import { BinaryRepository } from "./BinaryRepository.js";
import { BinaryService as BinaryServiceInterface } from "./types.js";

@injectable()
export class BinaryService implements BinaryServiceInterface {
    constructor(
        @inject(dependencies.BinaryRepository) private readonly repository: BinaryRepository,
    ) {}

    async saveScreenshot(base64Data: string): Promise<string> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `screenshot-${timestamp}.png`;
        const buffer = Buffer.from(base64Data, "base64");

        return this.repository.save(filename, buffer);
    }
}
