import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';

new Worker('corporationCreated', async job => {
  console.log(`[corporationCreated] Corporation ${job.data.corporation_id} created.`);
  // simulate API call or webhook
}, { connection });