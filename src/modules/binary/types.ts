export interface Binary {
    filename: string;
    mimeType: string;
}

export interface BinaryRepository {
    save(filename: string, data: Buffer): Promise<string>;
    getPath(filename: string): string;
    exists(filename: string): Promise<boolean>;
    getContent(filename: string): Promise<Buffer>;
}

export interface BinaryService {
    saveScreenshot(base64Data: string): Promise<Binary>;
    getScreenshotContent(binary: Binary): Promise<string>;
    getPath(binary: Binary): string;
}
