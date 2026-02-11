import { z as zod } from 'zod';

export const loggingConfigSchema = zod.object({
    level: zod.enum(['debug', 'info', 'warn', 'error']).default('info'),
    environment: zod.enum(['development', 'production']).default('development'),
});

export const journeyConfigSchema = zod.object({
    name: zod.string().default('default'),
    dir: zod.string().default('data/journeys'),
});

export const httpClientConfigSchema = zod.object({
    timeout: zod.number().default(30000),
});

export const configSchema = zod.object({
    axisApiUrl: zod.string().url(),
    http: httpClientConfigSchema,
    logging: loggingConfigSchema,
    journey: journeyConfigSchema,
});
