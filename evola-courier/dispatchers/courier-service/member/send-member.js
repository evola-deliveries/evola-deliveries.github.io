// dispatcher/send-contract.js
import { updateMember } from '../../../shared/queue.js'
import { createEventPayload } from '../../../shared/utils/createEventPayload.js';

export async function sendMemberToQueue(character_id, __currentMeta) {
  const newJob = createEventPayload({ character_id: character_id }, __currentMeta);
  await updateMember.add('process', newJob, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  });
}