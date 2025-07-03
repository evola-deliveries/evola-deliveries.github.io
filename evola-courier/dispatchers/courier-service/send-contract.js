// dispatcher/send-contract.js
import { processContract } from '../../shared/queue.js'
import { createEventPayload } from '../../shared/utils/createEventPayload.js';

export async function sendContractToQueue(contract) {
  const newJob = createEventPayload(contract);
  await processContract.add('process', newJob, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 }
  });
}