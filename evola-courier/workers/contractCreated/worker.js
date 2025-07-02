import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { updateMember, updateCorporation } from '../../shared/queue.js';

new Worker('contractCreated', async job => {
	const contract = job.data;
	
	try {
		const character_id = contract.issuer_id;
		console.log(`[contractCreated] Update Member ${character_id}.`);
		await updateMember.add('process', { character_id: character_id });
	} catch (ex) {
		console.log(ex);
		throw new Error();
	}
	
	try {
		const corporation_id = contract.issuer_corporation_id;
		console.log(`[contractCreated] Update Corporation ${corporation_id}.`);
		await updateCorporation.add('process', { corporation_id: corporation_id });
	} catch (ex) {
		console.log(ex);
		throw new Error();
	}
	console.log(`[contractCreated] Contract ${contract.contract_id} created.`);
}, { connection });