import { desc, gte } from 'drizzle-orm';
import { db } from '../db/index.ts';
import { transactions } from '../db/schema.ts';
import { FastifyInstance } from 'fastify';

export async function transactionRoutes(app: FastifyInstance) {
  app.post('/users', async () => {
    const result = await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.id))
      .where(gte(transactions.amount, '1500'));

    return result;
  });
}
