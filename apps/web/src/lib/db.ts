import { createDb } from '@statusly/worker/db-web';

const databaseUrl = process.env.DATABASE_URL!;
console.log('--------- DATABASE URL IS', databaseUrl);
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}
export const db = createDb(databaseUrl);
