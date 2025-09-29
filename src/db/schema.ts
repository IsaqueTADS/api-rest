import {
  decimal,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';

export const transactions = pgTable(
  'transactions',
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    session_id: uuid(),
    title: text().notNull(),
    amount: decimal({ precision: 10, scale: 2 }).notNull(),
    created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_session_id').on(table.session_id)]
);
