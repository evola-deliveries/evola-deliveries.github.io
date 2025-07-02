// dispatcher/send-contract.js
import { updateMember } from '../../shared/queue.js'

export async function sendMemberToQueue(character_id) {
  await updateMember.add('process', { character_id: character_id }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  });
}