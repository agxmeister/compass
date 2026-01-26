import { z as zod } from 'zod';

export const loggingConfigSchema = zod.object({
    level: zod.enum(['debug', 'info', 'warn', 'error']).default('info'),
    environment: zod.enum(['development', 'production']).default('development'),
    dir: zod.string().default('data/logs'),
    name: zod.string().default('compass.log'),
});

export const protocolConfigSchema = zod.object({
    name: zod.string().default('default'),
    dir: zod.string().default('data/protocols'),
});

export const configSchema = zod.object({
    axisApiUrl: zod.string().url(),
    logging: loggingConfigSchema,
    protocol: protocolConfigSchema,
});
