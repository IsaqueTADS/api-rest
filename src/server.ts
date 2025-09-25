import fastify from 'fastify';
import { db } from './db/index.ts';
import { transactions } from './db/schema.ts';

const app = fastify();
app.get('/users', async () => {
  const result = await db
    .insert(transactions)
    .values({
      title: 'Teste',
      amount: '1000',
    })
    .returning();

  return result;
});

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('🚀 Server running on port 3333!'));
