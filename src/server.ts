import fastify from 'fastify';
import { db } from './db/index.ts';
import { transactions } from './db/schema.ts';
import { asc, desc, eq, gte } from 'drizzle-orm';
import { env } from './env/index.ts';

const app = fastify();
app.get('/users', async () => {
  const result = await db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.id))
    .where(gte(transactions.amount, '1500'));

  return result;
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('🚀 Server running on port 3333!'));
