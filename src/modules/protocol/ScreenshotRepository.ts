import { injectable, inject } from "inversify";
import { promises as fs } from "fs";
import path from "path";
import { dependencies } from "@/dependencies.js";

@injectable()
export class ScreenshotRepository {
    constructor(
        @inject(dependencies.JourneyDir) private readonly journeyDir: string,
    ) {}

    private getScreenshotsDir(): string {
        return path.join(this.journeyDir, "screenshots");
    }

    async save(filename: string, data: Buffer): Promise<string> {
        const screenshotsDir = this.getScreenshotsDir();
        await fs.mkdir(screenshotsDir, { recursive: true });

        const filePath = path.join(screenshotsDir, filename);
        await fs.writeFile(filePath, data);

        return filePath;
    }
}
