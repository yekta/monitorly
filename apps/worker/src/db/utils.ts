import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import { statusChecks } from '../../drizzle/schema.js';

const createDb = (databaseUrl: string) => {
  const client = postgres(databaseUrl);
  const db = drizzle(client);
  return db;
};

export { createDb, sql, statusChecks };
