import { createDb } from './utils.js';

const databaseUrl = process.env.DATABASE_URL!;
if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set');
}

export const db = createDb(databaseUrl);
