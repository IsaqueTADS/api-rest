import fastify from 'fastify';

import { env } from './env/index.ts';
import { transactionRoutes } from './routes/transactions.ts';

const app = fastify();

app.register(transactionRoutes);

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('🚀 Server running on port 3333!'));
