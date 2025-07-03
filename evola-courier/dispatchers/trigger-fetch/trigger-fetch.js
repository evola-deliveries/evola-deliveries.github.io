// scheduler/fetch-contracts-daily.js

import { fetchContracts } from '../../shared/queue.js';
import { createEventPayload } from '../../shared/utils/createEventPayload.js';
import config from './config.js';

(async () => {
	const jobId = 'fetch-contracts-daily-scheduler';
	const pattern = config.trigger_fetch_cron || '0 4 * * *';

	const payload = createEventPayload();

	const jobTemplate = {
		name: 'fetch-contracts-daily',
		data: payload,
		opts: {
			removeOnComplete: true,
			removeOnFail: true,
			attempts: 3,
			backoff: { type: 'exponential', delay: 3000 }
		}
	};

	await fetchContracts.upsertJobScheduler(jobId, { pattern }, jobTemplate);

	console.log(`[fetch-contracts-daily] Job scheduler set: daily at ${pattern} UTC`);
})();