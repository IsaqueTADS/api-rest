import { db } from '../db/index.ts';
import { transactions } from '../db/schema.ts';

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const transactionRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/transactions',
    {
      schema: {
        tags: ['transactions'],
        body: z.object({
          title: z.string(),
        }),
        response: {
          200: z.object({
            transactions: z.array(
              z.object({
                id: z.string().uuid(),
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

    async (request, reply) => {
      const result = await db.select().from(transactions);
      return reply.status(200).send({ transactions: result });
    }
  );
};
