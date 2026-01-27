import { z as zod } from 'zod';

export const httpConfigSchema = zod.object({
    timeout: zod.number().default(30000),
});
