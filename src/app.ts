import fastify from 'fastify';

import { transactionRoutes } from './routes/transactions.ts';

import { fastifySwagger } from '@fastify/swagger';
import scalarAPIReference from '@scalar/fastify-api-reference';

import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';
import { env } from './env/index.ts';

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

app.register(transactionRoutes);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
