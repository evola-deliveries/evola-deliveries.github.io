// dispatcher/send-contract.js
import { memberCreated } from '../../shared/queue.js'

export async function sendMemberToQueue(character_id) {
  await memberCreated.add('process', { character_id: character_id }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  });
}