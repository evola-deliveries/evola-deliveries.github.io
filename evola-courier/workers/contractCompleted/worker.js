import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { sendEveMail } from '../../shared/queue.js';
import { createEventPayload } from '../../shared/utils/createEventPayload.js';

new Worker('contractCompleted', async job => {
	const { __meta, payload } = job.data;
	const contract = payload;

	try {
		const character_id = contract.issuer_id;
		console.log(`[contractCompleted] Send Completion of contract ${contract.contract_id} mail to ${character_id}.`);
		const nextJob = createEventPayload(contract, __meta);
		await sendEveMail.add('process', nextJob, {
			jobId: `contract-eve-mail-${contract.contract_id}`,
			attempts: 3,
			backoff: { type: 'exponential', delay: 2000 },
		});
	} catch (ex) {
		console.log(ex);
		throw new Error();
	}

	console.log(`[contractCompleted] Contract ${contract.contract_id} completed.`);
}, { connection });