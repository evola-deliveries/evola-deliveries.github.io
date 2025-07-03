import { Worker } from 'bullmq';
import { processContract } from '../../shared/queue.js';
import connection from '../../shared/redis.js';
import fetchFromESI from './fetchFromESI.js';
import { createEventPayload } from '../../shared/utils/createEventPayload.js';

new Worker('fetchContracts', async job => {
	const { __meta, payload } = job.data;

	console.log(`[fetchContracts] Fetching contracts.`);

	const contracts = await fetchFromESI();

	console.log(`[fetchContracts] Found ${contracts.length} contracts.`);

	for (const contract of contracts) {
		const nextJob = createEventPayload(contract, __meta);

		await processContract.add('process', nextJob, {
			attempts: 3,
			backoff: { type: 'exponential', delay: 2000 },
		});
	}
	console.log(`[fetchContracts] All Contracts queued.`);
}, { connection });