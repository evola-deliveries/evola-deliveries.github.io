import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { sendEveMail } from '../../shared/queue.js';
import { createEventPayload, createFrameMeta } from '../../shared/utils/createEventPayload.js';
import { logWithMeta } from '../../shared/utils/logWithMeta.js';

new Worker('contractCompleted', async job => {
	const { __meta, payload } = job.data;
	const __currentMeta = createFrameMeta(__meta);
	const contract = payload;

	try {
		const character_id = contract.issuer_id;
		logWithMeta('log', __currentMeta, `[contractCompleted] Send Completion of contract ${contract.contract_id} mail to ${character_id}.`);
		const nextJob = createEventPayload(contract, __currentMeta);
		await sendEveMail.add('process', nextJob, {
			jobId: `contract-eve-mail-${contract.contract_id}`,
			attempts: 3,
			backoff: { type: 'exponential', delay: 2000 },
		});
	} catch (ex) {
		logWithMeta('error', __currentMeta, ex);
		throw new Error();
	}

	logWithMeta('log', __currentMeta, `[contractCompleted] Contract ${contract.contract_id} completed.`);
}, { connection });