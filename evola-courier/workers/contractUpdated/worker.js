import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { contractCompleted } from '../../shared/queue.js';
import { createEventPayload } from '../../shared/utils/createEventPayload.js';

new Worker('contractUpdated', async job => {
	const { __meta, payload } = job.data;
	const contracts = payload;

	try {
		if (contracts.old.status !== 'finished' && contracts.new.status === 'finished') {
			console.log(`[contractUpdated] Contract ${contracts.new.contract_id} Completed.`);
			const nextJob = createEventPayload(contracts.new, __meta);
			await contractCompleted.add('completed', nextJob, {
				attempts: 3,
				backoff: { type: 'exponential', delay: 2000 },
			});
		}
	} catch (ex) {
		console.log(ex);
		throw new Error();
	}
	console.log(`[contractUpdated] Updated contract ${contracts.new.contract_id} to database.`);
}, { connection });