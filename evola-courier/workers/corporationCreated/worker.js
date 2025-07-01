import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { eveClient } from '../../shared/eve-esi.js';
import saveOrUpdateCorporation from './saveOrUpdateCorporation.js';

new Worker('corporationCreated', async job => {
	const { corporation_id } = job.data;
	if (!corporation_id) return;

	try {
		const corpData = await eveClient.getCorporationInfo(corporation_id);

		const result = await saveOrUpdateCorporation({
			...corpData,
			corporation_id // Ensure it's saved
		});

		console.log(`[corporationCreated] ${result.status}:${corporation_id}`);		
	} catch (err) {
		console.error(`[corporationCreated] Failed for corp ${corporation_id}`, err);
	}
}, { connection });
