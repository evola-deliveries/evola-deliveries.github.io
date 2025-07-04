import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { contractCompleted } from '../../shared/queue.js';
import { createEventPayload, createFrameMeta } from '../../shared/utils/createEventPayload.js';
import { logWithMeta } from '../../shared/utils/logWithMeta.js';

new Worker('contractUpdated', async job => {
	const { __meta, payload } = job.data;
	const __currentMeta = createFrameMeta(__meta);
	const contracts = payload;

	try {
		if (contracts.old.status !== 'finished' && contracts.new.status === 'finished') {
			logWithMeta('log', __currentMeta, `[contractUpdated] Contract ${contracts.new.contract_id} Completed.`);
			const nextJob = createEventPayload(contracts.new, __currentMeta);
			await contractCompleted.add('completed', nextJob, {
				attempts: 3,
				backoff: { type: 'exponential', delay: 2000 },
			});
		}
	} catch (ex) {
		logWithMeta('error', __currentMeta, ex);
		throw new Error();
	}
	logWithMeta('log', __currentMeta, `[contractUpdated] Updated contract ${contracts.new.contract_id} to database.`);
}, { connection });