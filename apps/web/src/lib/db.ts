import { createDb } from '@statusly/worker/db-utils';

const databaseUrl = process.env.DATABASE_URL!;
if (!databaseUrl) {
  throw new Error('NextJS: DATABASE_URL is not defined');
}

export const db = createDb(databaseUrl);