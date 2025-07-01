import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { contractCreated, contractUpdated } from '../../shared/queue.js';
import saveOrUpdateContract from './saveOrUpdateContract.js';

new Worker('processContract', async job => {
  const contract = job.data;

  console.log(`[processContract] Processing Contract ${job.data.contract_id}.`);
let result = { status: null };
  try {
    result = await saveOrUpdateContract(contract);
  }catch(ex)
  {
    console.log(ex);
    throw new Error();
  }
  console.log(`[processContract] Contract ${job.data.contract_id} status ${result.status}.`);

  if (result.status === 'created') {
    await contractCreated.add('created', result.contract);
  } else if (result.status === 'updated') {
    await contractUpdated.add('updated', result.contract);
  }
}, { connection });