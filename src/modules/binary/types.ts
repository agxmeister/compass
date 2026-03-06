export interface Binary {
    filename: string;
    mimeType: string;
}

export interface BinaryService {
    saveScreenshot(base64Data: string): Promise<Binary>;
    getScreenshotContent(binary: Binary): Promise<string>;
    getPath(binary: Binary): string;
}
