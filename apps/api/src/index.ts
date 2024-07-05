import 'dotenv/config';
import Fastify from 'fastify';
import fastifyCron from 'fastify-cron';
import { monitors } from '../../../monitor.config.js';
import { statusChecks } from '../drizzle/schema.js';
import { db } from './db/db.js';

const PORT = Number(process.env.PORT || '3001');
const server = Fastify({
  logger: false
});

// @ts-ignore
server.register(fastifyCron, {
  jobs: monitors.map((monitor) => ({
    cronTime: `* * * * *`,
    onTick: async () => {
      console.log(`Running job [${monitor.id}]`);

      const startDate = new Date();
      const start = performance.now();
      let end = start;
      let isFail = false;

      // Make the call
      try {
        const isSuccess = await monitor.functionToRun();
        console.log(`Job [${monitor.id}] finished with result: ${isSuccess}`);
        if (isSuccess === false) {
          isFail = true;
        }
      } catch (error) {
        console.error(`Job [${monitor.id}] failed with error`, error);
        isFail = true;
      } finally {
        end = performance.now();
      }

      const durationMs = Math.round(end - start);

      // Write to database
      try {
        await db.insert(statusChecks).values([
          {
            monitorId: monitor.id,
            checkedAt: startDate,
            durationMs,
            isFail
          }
        ]);
        console.log(`Successfully wrote to database for job [${monitor.id}]`);
      } catch (error) {
        console.error(`Failed to write to database`, error);
      }
    }
  }))
});

server.get('/', async (request, reply) => {
  return { message: 'running' };
});

server.get('/health', async (request, reply) => {
  return { message: 'ok' };
});

server.listen({ port: PORT }, (err, address) => {
  if (err) throw err;
  console.log(`Server is now listening on port: ${PORT}`);
  server.cron.startAllJobs();
});
