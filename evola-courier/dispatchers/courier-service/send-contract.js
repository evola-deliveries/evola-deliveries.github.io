// dispatcher/send-contract.js
import { processContract } from '../../shared/queue.js'

export async function sendContractToQueue(contract) {
  await processContract.add('process', contract, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 }
  });
}