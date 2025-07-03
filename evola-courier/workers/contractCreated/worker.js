import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { updateMember, updateCorporation } from '../../shared/queue.js';
import { createEventPayload } from '../../shared/utils/createEventPayload.js';

new Worker('contractCreated', async job => {
	const { __meta, payload } = job.data;
	const contract = payload;
	
	try {
		const character_id = contract.issuer_id;
		console.log(`[contractCreated] Update Member ${character_id}.`);
		const nextJob = createEventPayload({ character_id: character_id }, __meta);
		await updateMember.add('process', { character_id: character_id }, nextJob, {
				attempts: 3,
				backoff: { type: 'exponential', delay: 2000 },
			});
	} catch (ex) {
		console.log(ex);
		throw new Error();
	}
	
	try {
		const corporation_id = contract.issuer_corporation_id;
		console.log(`[contractCreated] Update Corporation ${corporation_id}.`);
		const nextJob = createEventPayload({ corporation_id: corporation_id }, __meta);
		await updateCorporation.add('process', nextJob, {
				attempts: 3,
				backoff: { type: 'exponential', delay: 2000 },
			});
	} catch (ex) {
		console.log(ex);
		throw new Error();
	}
	console.log(`[contractCreated] Contract ${contract.contract_id} created.`);
}, { connection });