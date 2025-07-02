import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { eveClient } from '../../shared/eve-esi.js';
import saveOrUpdateMember from './saveOrUpdateMember.js';

new Worker('updateMember', async job => {
	const { character_id } = job.data;
	if (!character_id) return;

	try {
		const memberData = await eveClient.getCharacterInfo(character_id);

		const result = await saveOrUpdateMember({
			...memberData,
			character_id // Ensure it's saved
		});

		console.log(`[updateMember] Member ${character_id} ${result.status}`);
	} catch (err) {
		console.error(`[updateMember] Failed for member ${character_id}`, err);
	}
}, { connection });