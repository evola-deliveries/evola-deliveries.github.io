// dispatcher/send-contract.js
import { updateCorporation } from '../../shared/queue.js'

export async function sendCorporationToQueue(corporation_id) {
  await updateCorporation.add('process', { corporation_id: corporation_id }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  });
}