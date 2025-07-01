import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { contractCompleted } from '../../shared/queue.js';

new Worker('contractUpdated', async job => {
  const contract = job.data;

  if (contract.status === 'finished') {
    await contractCompleted.add('completed', contract);
  }

  console.log(`[contractUpdated] Updated contract ${job.data.contract_id} to database.`);

  // simulate DB write
}, { connection });