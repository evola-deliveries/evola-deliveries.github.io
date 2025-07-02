import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { contractCompleted } from '../../shared/queue.js';

new Worker('contractUpdated', async job => {
	const contracts = job.data;

	try {
		if (contracts.old.status !== 'finished' && contracts.new.status === 'finished') {
			console.log(`[contractUpdated] Contract ${contracts.new.contract_id} Completed.`);
			await contractCompleted.add('completed', contracts.new);
		}
	} catch (ex) {
		console.log(ex);
		throw new Error();
	}

	console.log(`[contractUpdated] Updated contract ${contracts.new.contract_id} to database.`);
}, { connection });