import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { statusChecks } from '../../drizzle/schema.js';
import { sql } from 'drizzle-orm';

const databaseUrl = process.env.DATABASE_URL!;
if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set');
}
const client = postgres(databaseUrl);
const db = drizzle(client);
export { statusChecks, db, sql };
