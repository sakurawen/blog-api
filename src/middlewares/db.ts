import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '~/schema';
import { factory } from './factory';

let sql: ReturnType<typeof neon>;
let db: NeonHttpDatabase<typeof schema>;
export const drizzleMiddleware = factory.createMiddleware(async (c, next) => {
  if (!db) {
    sql = neon(c.env.DATABASE_URL);
    db = drizzle({ client: sql, schema, casing: 'snake_case' });
    c.set('db', db);
  }
  else {
    c.set('db', db);
  }
  await next();
});
