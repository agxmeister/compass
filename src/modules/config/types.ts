import { z as zod } from 'zod';
import { configSchema, httpClientConfigSchema, loggingConfigSchema, protocolConfigSchema } from './schemas.js';

export type HttpClientConfig = zod.infer<typeof httpClientConfigSchema>;
export type LoggingConfig = zod.infer<typeof loggingConfigSchema>;
export type ProtocolConfig = zod.infer<typeof protocolConfigSchema>;
export type Config = zod.infer<typeof configSchema>;
