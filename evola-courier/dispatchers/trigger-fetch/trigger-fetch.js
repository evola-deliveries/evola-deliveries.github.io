import { fetchContracts } from '../../shared/queue.js';
import { createEventPayload } from '../../shared/utils/createEventPayload.js';

(async () => {
	const newJob = createEventPayload();
	await fetchContracts.add('start', newJob, {
		attempts: 3,
		backoff: { type: 'exponential', delay: 3000 }
	});
})();