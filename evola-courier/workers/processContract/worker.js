import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { contractCreated, contractUpdated } from '../../shared/queue.js';
import saveOrUpdateContract from './saveOrUpdateContract.js';
import { createEventPayload, createFrameMeta } from '../../shared/utils/createEventPayload.js';
import { logWithMeta } from '../../shared/utils/logWithMeta.js';

new Worker('processContract', async job => {
	const { __meta, payload } = job.data;
	const __currentMeta = createFrameMeta(__meta);
	const contract = payload;

	logWithMeta('log', __currentMeta, `[processContract] Processing Contract ${contract.contract_id}.`);
	let result = { status: null };
	try {
		if (contract.type !== 'courier') {
			result.status = 'ignored'
		} else {
			result = await saveOrUpdateContract(contract);
		}
	} catch (ex) {
		logWithMeta('error', __currentMeta, ex);
		throw new Error();
	}

	logWithMeta('log', __currentMeta, `[processContract] Contract ${contract.contract_id} status ${result.status}.`);

	try {
		if (result.status === 'created') {
			const nextJob = createEventPayload(result.contract, __currentMeta);
			await contractCreated.add('created', nextJob, {
				attempts: 3,
				backoff: { type: 'exponential', delay: 2000 },
			});
		} else if (result.status === 'updated') {
			const nextJob = createEventPayload({ old: result.old, new: result.new }, __currentMeta);
			await contractUpdated.add('updated', nextJob, {
				attempts: 3,
				backoff: { type: 'exponential', delay: 2000 },
			});
		}
	} catch (ex) {
		logWithMeta('error', __currentMeta, ex);
		throw new Error();
	}

	logWithMeta('log', __currentMeta, `[processContract] Contract ${contract.contract_id} processed.`);
}, { connection });