import { z as zod } from 'zod';
import { configSchema, httpClientConfigSchema, journeyConfigSchema, loggingConfigSchema } from './schemas.js';

export type HttpClientConfig = zod.infer<typeof httpClientConfigSchema>;
export type LoggingConfig = zod.infer<typeof loggingConfigSchema>;
export type JourneyConfig = zod.infer<typeof journeyConfigSchema>;
export type Config = zod.infer<typeof configSchema>;
