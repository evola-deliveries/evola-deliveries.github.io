import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { eveClient } from '../../shared/eve-esi.js';
import saveOrUpdateCorporation from './saveOrUpdateCorporation.js';

new Worker('updateCorporation', async job => {
	const { corporation_id } = job.data;
	if (!corporation_id) return;

	try {
		const corpData = await eveClient.getCorporationInfo(corporation_id);

		const result = await saveOrUpdateCorporation({
			...corpData,
			corporation_id
		});

		console.log(`[updateCorporation] Corporation ${corporation_id} ${result.status}`);		
	} catch (err) {
		console.error(`[updateCorporation] Failed for corporation ${corporation_id}`, err);
	}
}, { connection });
