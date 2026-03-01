import { z as zod } from 'zod';
import { configSchema, httpClientConfigSchema, journeyConfigSchema, logConfigSchema } from './schemas.js';

export type HttpClientConfig = zod.infer<typeof httpClientConfigSchema>;
export type LogConfig = zod.infer<typeof logConfigSchema>;
export type JourneyConfig = zod.infer<typeof journeyConfigSchema>;
export type Config = zod.infer<typeof configSchema>;
