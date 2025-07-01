import { Worker } from 'bullmq';
import { processContract } from '../../shared/queue.js';
import connection from '../../shared/redis.js';
import fetchFromESI from './fetchFromESI.js';

new Worker('fetchContracts', async job => {
  console.log(`[fetchContracts] Fetching contracts.`);
  
  const contracts = await fetchFromESI();

  console.log(`[fetchContracts] Found ${contracts.length} contracts.`);
  
  for (const contract of contracts) {
    await processContract.add('process', contract, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }
}, { connection });