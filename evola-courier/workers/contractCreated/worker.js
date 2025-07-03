import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { updateMember, updateCorporation } from '../../shared/queue.js';
import { createEventPayload, createFrameMeta } from '../../shared/utils/createEventPayload.js';
import { logWithMeta } from '../../shared/utils/logWithMeta.js';

new Worker('contractCreated', async job => {
	const { __meta, payload } = job.data;
	const __currentMeta = createFrameMeta(__meta);
	const contract = payload;
	
	try {
		const character_id = contract.issuer_id;
		logWithMeta('log', __currentMeta, `[contractCreated] Update Member ${character_id}.`);
		const nextJob = createEventPayload({ character_id: character_id }, __currentMeta);
		await updateMember.add('process', { character_id: character_id }, nextJob, {
				attempts: 3,
				backoff: { type: 'exponential', delay: 2000 },
			});
	} catch (ex) {
		logWithMeta('error', __currentMeta, ex);
		throw new Error();
	}
	
	try {
		const corporation_id = contract.issuer_corporation_id;
		logWithMeta('log', __currentMeta, `[contractCreated] Update Corporation ${corporation_id}.`);
		const nextJob = createEventPayload({ corporation_id: corporation_id }, __currentMeta);
		await updateCorporation.add('process', nextJob, {
				attempts: 3,
				backoff: { type: 'exponential', delay: 2000 },
			});
	} catch (ex) {
		logWithMeta('error', __currentMeta, ex);
		throw new Error();
	}
	logWithMeta('log', __currentMeta, `[contractCreated] Contract ${contract.contract_id} created.`);
}, { connection });