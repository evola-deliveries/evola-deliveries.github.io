import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { eveClient } from '../../shared/eve-esi.js';
import saveOrUpdateCorporation from './saveOrUpdateCorporation.js';
import { createFrameMeta } from '../../shared/utils/createEventPayload.js';
import { logWithMeta } from '../../shared/utils/logWithMeta.js';

new Worker('updateCorporation', async job => {
	const { __meta, payload } = job.data;
	const __currentMeta = createFrameMeta(__meta);
	const { corporation_id } = payload;
	if (!corporation_id) {
		logWithMeta('log', __currentMeta, `[updateCorporation] Corporation Id was empty nothing to update.`);		
		return;
	}

	try {
		const corpData = await eveClient.getCorporationInfo(corporation_id);

		const result = await saveOrUpdateCorporation({
			...corpData,
			corporation_id
		});

		logWithMeta('log', __currentMeta, `[updateCorporation] Corporation ${corporation_id} ${result.status}`);		
	} catch (err) {
		logWithMeta('error', __currentMeta, `[updateCorporation] Failed for corporation ${corporation_id}`, err);
	}
}, { connection });
