import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { eveClient } from '../../shared/eve-esi.js';
import saveOrUpdateMember from './saveOrUpdateMember.js';

new Worker('memberCreated', async job => {
  console.log(`[memberCreated] Member ${job.data.character_id} created.`);
  
  const { character_id } = job.data;
  if (!character_id) return;

  try {
    const memberData = await eveClient.getCharacterInfo(character_id);

    const result = await saveOrUpdateMember({
      ...memberData,
      character_id // Ensure it's saved
    });

    console.log(`[memberCreated] ${result.status}:${character_id}`);		
  } catch (err) {
    console.error(`[memberCreated] Failed for member ${character_id}`, err);
  }
}, { connection });