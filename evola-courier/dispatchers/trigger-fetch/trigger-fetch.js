// scheduler/fetch-contracts-daily.js

import { fetchContracts } from '../../shared/queue.js';
import { createEventPayload } from '../../shared/utils/createEventPayload.js';
import config from './config.js';

(async () => {
	const newJob = createEventPayload();

	await fetchContracts.add('start', newJob, {
		jobId: 'daily-fetch-contracts',
		repeat: {
			cron: config.trigger_fetch_cron
		},
		removeOnComplete: true,
		removeOnFail: true,
		attempts: 3,
		backoff: { type: 'exponential', delay: 3000 }
	});

	console.log('[fetch-contracts-daily] Scheduled fetchContracts job daily at 04:00 UTC');
})();
