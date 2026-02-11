import { injectable } from 'inversify';
import { configSchema } from './schemas.js';
import type { Config } from './types.js';

@injectable()
export class ConfigFactory {
    create(): Config {
        return configSchema.parse({
            axisApiUrl: process.env.AXIS_API_URL,
            http: {
                timeout: process.env.HTTP_TIMEOUT ? parseInt(process.env.HTTP_TIMEOUT, 10) : undefined,
            },
            logging: {
                level: process.env.LOG_LEVEL,
                environment: process.env.LOG_ENVIRONMENT,
            },
            journey: {
                name: process.env.JOURNEY_NAME,
                dir: process.env.JOURNEY_DIR,
            },
        });
    }
}
