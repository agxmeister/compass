import { injectable, inject } from "inversify";
import { promises as fs } from "fs";
import path from "path";
import { dependencies } from "@/dependencies.js";

@injectable()
export class ScreenshotService {
    constructor(
        @inject(dependencies.ProtocolDir) private readonly protocolDir: string,
        @inject(dependencies.ProtocolName) private readonly protocolName: string,
    ) {}

    private getScreenshotsDir(): string {
        return path.join(this.protocolDir, this.protocolName, "screenshots");
    }

    async saveScreenshot(base64Data: string): Promise<string> {
        const screenshotsDir = this.getScreenshotsDir();
        await fs.mkdir(screenshotsDir, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `screenshot-${timestamp}.png`;
        const filePath = path.join(screenshotsDir, filename);

        const buffer = Buffer.from(base64Data, "base64");
        await fs.writeFile(filePath, buffer);

        return filePath;
    }
}
