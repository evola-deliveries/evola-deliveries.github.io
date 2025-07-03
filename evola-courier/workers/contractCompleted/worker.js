import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { sendEveMail } from '../../shared/queue.js';

new Worker('contractCompleted', async job => {
	const contract = job.data;

	try {
		const character_id = contract.issuer_id;
		console.log(`[contractCompleted] Send Completion of contract ${contract.contract_id} mail to ${character_id}.`);
		await sendEveMail.add('process', contract, {
			jobId: `contract-eve-mail-${contract.contract_id}`
		});
	} catch (ex) {
		console.log(ex);
		throw new Error();
	}

	console.log(`[contractCompleted] Contract ${contract.contract_id} completed.`);
}, { connection });