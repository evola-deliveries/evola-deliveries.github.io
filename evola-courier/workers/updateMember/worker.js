import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { eveClient } from '../../shared/eve-esi.js';
import saveOrUpdateMember from './saveOrUpdateMember.js';
import { createFrameMeta } from '../../shared/utils/createEventPayload.js';
import { logWithMeta } from '../../shared/utils/logWithMeta.js';

new Worker('updateMember', async job => {
	const { __meta, payload } = job.data;
	const __currentMeta = createFrameMeta(__meta);
	const { character_id } = payload;
	if (!character_id) {
		logWithMeta('log', __currentMeta, `[updateMember] Member character id was empty nothing to update.`);
		return};

	try {
		const memberData = await eveClient.getCharacterInfo(character_id);

		const result = await saveOrUpdateMember({
			...memberData,
			character_id // Ensure it's saved
		});

		logWithMeta('log', __currentMeta, `[updateMember] Member ${character_id} ${result.status}`);
	} catch (err) {
		logWithMeta('error', __currentMeta, `[updateMember] Failed for member ${character_id}`, err);
	}
}, { connection });