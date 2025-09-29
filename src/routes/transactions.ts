import { and, eq, SQL, sum } from 'drizzle-orm';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';

import { db } from '../db/index.ts';
import { transactions } from '../db/schema.ts';
import { checkSessionIdExists } from '../middlewares/check-session-id-exist.ts';

export const transactionRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
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
          401: z.object({
            error: z.string().describe('Unauthorized.'),
          }),
        },
      },
    },
    async (request) => {
      const sessionId = request.sessionId!;

      const result = await db
        .select()
        .from(transactions)
        .where(eq(transactions.session_id, sessionId));

      return { transactions: result };
    }
  );

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
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
      const sessionId = request.sessionId!;

      console.log('sesssion', sessionId);
      console.log('oi');

      const conditions: SQL[] = [];

      conditions.push(eq(transactions.id, id));
      conditions.push(eq(transactions.session_id, sessionId));

      const transaction = await db
        .select()
        .from(transactions)
        .where(and(...conditions));

      return { transaction: transaction[0] };
    }
  );

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
      schema: {
        preHandler: [checkSessionIdExists],
        tags: ['transactions'],
        summary: 'get summary',
      },
    },
    async (request) => {
      const sessionId = request.sessionId!;

      const summary = await db
        .select({ amount: sum(transactions.amount) })
        .from(transactions)
        .where(eq(transactions.session_id, sessionId));

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

      let sessionId = request.cookies.sessionId;

      if (!sessionId) {
        sessionId = uuidv7();

        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }

      await db.insert(transactions).values({
        title,
        amount:
          type === 'credit'
            ? amount
            : (Number(amount) * -1).toFixed(2).toString(),
        session_id: sessionId,
      });

      return reply.status(201).send();
    }
  );
};
