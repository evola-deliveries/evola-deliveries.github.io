import { fetchContracts } from '../../shared/queue.js';

(async () => {
  await fetchContracts.add('start', {}, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 3000 }
  });
})();