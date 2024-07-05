import 'dotenv/config';
import Fastify from 'fastify';
import { db } from './db/db.js';

const PORT = Number(process.env.PORT || '3001');
const fastify = Fastify({
  logger: false
});

fastify.get('/', async (request, reply) => {
  return { message: 'running' };
});

fastify.get('/health', async (request, reply) => {
  return { message: 'ok' };
});

fastify.listen({ port: PORT }, (err, address) => {
  if (err) throw err;
  fastify.log.info(`Server is now listening on ${address}`);
});