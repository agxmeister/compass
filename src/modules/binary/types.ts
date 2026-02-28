export interface BinaryService {
    saveScreenshot(base64Data: string): Promise<string>;
}
