import cookie from '@fastify/cookie';
import { fastifySwagger } from '@fastify/swagger';
import scalarAPIReference from '@scalar/fastify-api-reference';
import fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { env } from './env/index.ts';
import { transactionRoutes } from './routes/transactions.ts';

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
};

export const app = fastify({
  logger: envToLogger[env.NODE_ENV] ?? true,
}).withTypeProvider<ZodTypeProvider>();

app.register(cookie);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Api REST NodeJS',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

app.register(scalarAPIReference, {
  routePrefix: '/docs',
  configuration: {
    theme: 'deepSpace',
  },
});

app.register(transactionRoutes, {
  prefix: 'transactions',
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
