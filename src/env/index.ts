import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  PORT: z.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('🔺 Invalid environment variable!', _env.error.format());

  throw new Error('Invalid envirionment variable');
}
export const env = _env.data;
