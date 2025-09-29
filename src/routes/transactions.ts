import { eq, sum } from 'drizzle-orm';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { db } from '../db/index.ts';
import { transactions } from '../db/schema.ts';

export const transactionRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/',
    {
      schema: {
        tags: ['transactions'],
        summary: 'get all transactions',
        response: {
          200: z.object({
            transactions: z.array(
              z.object({
                id: z.string(),
                session_id: z.string().nullable(),
                title: z.string(),
                amount: z.string(),
                created_at: z.date(),
              })
            ),
          }),
        },
      },
    },
    async () => {
      const result = await db.select().from(transactions);

      return { transactions: result };
    }
  );

  app.get(
    '/:id',
    {
      schema: {
        tags: ['transactions'],
        summary: 'get transaction by id',
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({
            transaction: z.object({
              id: z.string(),
              session_id: z.string().nullable(),
              title: z.string(),
              amount: z.string(),
              created_at: z.date(),
            }),
          }),
        },
      },
    },
    async (request) => {
      const { id } = request.params;

      const transaction = await db
        .select()
        .from(transactions)
        .where(eq(transactions.id, id));

      return { transaction: transaction[0] };
    }
  );

  app.get(
    '/summary',
    {
      schema: {
        tags: ['transactions'],
        summary: 'get summary',
      },
    },
    async () => {
      const summary = await db
        .select({ amount: sum(transactions.amount) })
        .from(transactions);

      return { summary: summary[0] };
    }
  );

  app.post(
    '/',
    {
      schema: {
        tags: ['transactions'],
        summary: 'create a transation',
        body: z.object({
          title: z.string(),
          amount: z.string(),
          type: z.enum(['credit', 'debit']),
        }),
        response: {
          201: z.null(),
        },
      },
    },

    async (request, reply) => {
      const { title, amount, type } = request.body;

      await db.insert(transactions).values({
        title,
        amount:
          type === 'credit'
            ? amount
            : (Number(amount) * -1).toFixed(2).toString(),
      });

      return reply.status(201).send();
    }
  );
};
