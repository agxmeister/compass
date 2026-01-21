import { injectable, inject } from "inversify";
import { dependencies } from "@/dependencies.js";
import { ScreenshotRepository } from "./ScreenshotRepository.js";
import { ScreenshotService as ScreenshotServiceInterface } from "./types.js";

@injectable()
export class ScreenshotService implements ScreenshotServiceInterface {
    constructor(
        @inject(dependencies.ScreenshotRepository) private readonly repository: ScreenshotRepository,
    ) {}

    async saveScreenshot(base64Data: string): Promise<string> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `screenshot-${timestamp}.png`;
        const buffer = Buffer.from(base64Data, "base64");

        return this.repository.save(filename, buffer);
    }
}
