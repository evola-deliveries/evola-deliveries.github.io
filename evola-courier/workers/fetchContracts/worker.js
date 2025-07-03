import { Worker } from 'bullmq';
import { processContract } from '../../shared/queue.js';
import connection from '../../shared/redis.js';
import fetchFromESI from './fetchFromESI.js';
import { createEventPayload, createFrameMeta } from '../../shared/utils/createEventPayload.js';
import { logWithMeta } from '../../shared/utils/logWithMeta.js';

new Worker('fetchContracts', async job => {
	const { __meta, payload } = job.data;
	const __currentMeta = createFrameMeta(__meta);

	logWithMeta('log', __currentMeta, `[fetchContracts] Fetching contracts.`);

	const contracts = await fetchFromESI();

	logWithMeta('log', __currentMeta, `[fetchContracts] Found ${contracts.length} contracts.`);

	for (const contract of contracts) {
		const nextJob = createEventPayload(contract, __currentMeta);

		await processContract.add('process', nextJob, {
			attempts: 3,
			backoff: { type: 'exponential', delay: 2000 },
		});
	}
	logWithMeta('log', __currentMeta, `[fetchContracts] All Contracts queued.`);
}, { connection });