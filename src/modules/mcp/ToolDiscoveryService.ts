import { injectable, inject } from 'inversify';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { dependencies } from '@/dependencies.js';

@injectable()
export class ToolDiscoveryService {
    constructor(@inject(dependencies.ToolsDirectory) private readonly toolsDirectory: string) {}

    async discoverTools(): Promise<void> {
        try {
            const files = await readdir(this.toolsDirectory);
            const toolFiles = files.filter(
                (file) => file.endsWith('Tool.ts') || file.endsWith('Tool.js')
            );

            if (toolFiles.length === 0) {
                return;
            }

            for (const toolFile of toolFiles) {
                await import(join(this.toolsDirectory, toolFile));
            }
        } catch {
        }
    }
}
