import { inject, injectable } from 'inversify';
import pino from 'pino';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { dependencies } from '@/dependencies.js';
import { Logger as LoggerInterface } from './types.js';

@injectable()
export class LoggerFactory {
    private readonly pinoInstance;

    constructor(
        @inject(dependencies.LoggingLevel) level: string,
        @inject(dependencies.LoggingEnvironment) environment: string,
        @inject(dependencies.LoggingDir) logsDir: string,
        @inject(dependencies.LoggingName) fileName: string,
    ) {
        // Ensure the log directory exists
        mkdirSync(logsDir, { recursive: true });

        const fullPath = join(logsDir, fileName);

        const destination = pino.destination({
            dest: fullPath,
            sync: false,
        });

        this.pinoInstance = pino({
            level,
            transport: environment !== 'production' ? {
                target: 'pino-pretty',
                options: {
                    colorize: false,
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                    destination: fullPath,
                },
            } : undefined,
        }, destination);
    }

    createLogger(): LoggerInterface {
        const logger = this.pinoInstance;

        return {
            debug: (message: string, context?: Record<string, unknown>) => {
                logger.debug(context, message);
            },

            info: (message: string, context?: Record<string, unknown>) => {
                logger.info(context, message);
            },

            warn: (message: string, context?: Record<string, unknown>) => {
                logger.warn(context, message);
            },

            error: (message: string, context?: Record<string, unknown>) => {
                logger.error(context, message);
            },
        };
    }
}
