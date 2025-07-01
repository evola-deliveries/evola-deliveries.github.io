import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';

new Worker('contractCompleted', async job => {
  console.log(`[contractCompleted] Contract ${job.data.contract_id} completed.`);
  // simulate API call or webhook
}, { connection });