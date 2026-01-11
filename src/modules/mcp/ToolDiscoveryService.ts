import { injectable, inject } from 'inversify';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { dependencies } from '@/dependencies.js';
import { Logger as LoggerInterface, LoggerFactory } from '@/modules/logging/index.js';

@injectable()
export class ToolDiscoveryService {
    private readonly logger: LoggerInterface;

    constructor(
        @inject(dependencies.ToolsDirectory) private readonly toolsDirectory: string,
        @inject(dependencies.LoggerFactory) loggerFactory: LoggerFactory,
    ) {
        this.logger = loggerFactory.createLogger();
    }

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
                try {
                    await import(join(this.toolsDirectory, toolFile));
                    this.logger.info('Tool discovered', { file: toolFile });
                } catch (error) {
                    this.logger.error('Failed to import tool', { file: toolFile, error });
                }
            }
        } catch (error) {
            this.logger.error('Tool discovery failed', { error });
        }
    }
}
