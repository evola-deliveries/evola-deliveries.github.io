import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';

new Worker('sendEveMail', async job => {
	console.log(`[sendEveMail] Received mail signal for Contract ${job.data.contract_id}.`);
	// simulate API call or webhook

	const contract = job.data;
	
	try {
		const character_id = contract.issuer_id;
		console.log(`[sendEveMail] Sending mail to Member ${character_id}.`);
		// send
	} catch (ex) {
		console.log(ex);
		throw new Error();
	}
}, { connection });