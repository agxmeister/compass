import { inject, injectable } from 'inversify';
import pino from 'pino';
import { dependencies } from '@/dependencies.js';
import { Logger as LoggerInterface } from './types.js';

@injectable()
export class LoggerFactory {
    private readonly pinoInstance;

    constructor(
        @inject(dependencies.LoggingLevel) level: string,
        @inject(dependencies.LoggingEnvironment) environment: string,
        @inject(dependencies.LoggingFilePath) filePath: string,
    ) {
        const destination = pino.destination({
            dest: filePath,
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
                    destination: filePath,
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
