// dispatcher/send-contract.js
import { updateCorporation } from '../../../shared/queue.js'
import { createEventPayload } from '../../../shared/utils/createEventPayload.js';

export async function sendCorporationToQueue(corporation_id, __currentMeta) {
  const newJob = createEventPayload({ corporation_id: corporation_id }, __currentMeta);
  await updateCorporation.add('process', newJob, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  });
}