import { injectable } from 'inversify';
import { configSchema } from './schemas.js';
import type { Config } from './types.js';

@injectable()
export class ConfigFactory {
    create(): Config {
        return configSchema.parse({
            axisApiUrl: process.env.AXIS_API_URL,
            logging: {
                level: process.env.LOG_LEVEL,
                environment: process.env.LOG_ENVIRONMENT,
                dir: process.env.LOG_DIR,
                name: process.env.LOG_NAME,
            },
            protocol: {
                name: process.env.PROTOCOL_NAME,
                dir: process.env.PROTOCOL_DIR,
            },
        });
    }
}
