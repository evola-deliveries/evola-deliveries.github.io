// dispatcher/send-contract.js
import { corporationCreated } from '../../shared/queue.js'

export async function sendCorporationToQueue(corporation_id) {
  await corporationCreated.add('process', { corporation_id: corporation_id }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  });
}