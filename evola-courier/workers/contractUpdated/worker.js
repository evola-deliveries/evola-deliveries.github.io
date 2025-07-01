import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { contractCompleted } from '../../shared/queue.js';

new Worker('contractUpdated', async job => {
  const contracts = job.data;

  if (contracts.old.status !== 'finished' && contracts.new.status === 'finished') {
    await contractCompleted.add('completed', contracts.new);
  }

  console.log(`[contractUpdated] Updated contract ${contracts.new.contract_id} to database.`);

  // simulate DB write
}, { connection });