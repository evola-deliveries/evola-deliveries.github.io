import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';

new Worker('contractCreated', async job => {
  console.log(`[contractCreated] Contract ${job.data.contract_id} created.`);
  // simulate API call or webhook
}, { connection });