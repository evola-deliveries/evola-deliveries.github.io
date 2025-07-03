// dispatcher/send-contract.js
import { processContract } from '../../shared/queue.js'
import { createEventPayload } from '../../shared/utils/createEventPayload.js';

export async function sendContractToQueue(contract, __currentMeta) {
  const newJob = createEventPayload(contract, __currentMeta);
  await processContract.add('process', newJob, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 }
  });
}