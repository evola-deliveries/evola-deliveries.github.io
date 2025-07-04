import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { withRedisLock } from '../../shared/utils/withRedisLock.js';
import sendEveMailIfRequired from './sendEveMailIfRequired.js';
import { createEventPayload, createFrameMeta } from '../../shared/utils/createEventPayload.js';
import { logWithMeta } from '../../shared/utils/logWithMeta.js';
import config from './config.js';

new Worker(
	'sendEveMail',
	async job => {
		const { __meta, payload } = job.data;
		const __currentMeta = createFrameMeta(__meta);
		const contract = payload;
		const lockKey = `lock:sendEveMail:${contract.contract_id}`;

		logWithMeta('log', __currentMeta, `[sendEveMail] Received for Contract ${contract.contract_id}`);

		await withRedisLock(lockKey, 60, async () => {
			const result = await sendEveMailIfRequired(contract);

			if (result.status === 'rate_limited' && result.retryAfter) {
				const delay = result.retryAfter + config.send_mail_buffer;
				logWithMeta('warn', __currentMeta, `[sendEveMail] Rate limited. Retrying contract ${contract.contract_id} after ${delay}ms`);

				const nextJob = createEventPayload(contract, __currentMeta);

				await job.queue.add('process', nextJob, {
					delay,
					attempts: 3,
					backoff: { type: 'fixed', delay },
					jobId: `retry-contract-mail-${contract.contract_id}`, // idempotent retry
				});

				return;
			}

			if (result.status === 'failed') {
				logWithMeta('warn', __currentMeta, `[sendEveMail] Mail failed for contract ${contract.contract_id}:`, result.error);
			} else {
				logWithMeta('log', __currentMeta, `[sendEveMail] Mail status for contract ${contract.contract_id}: ${result.status}`);
			}
		});
	},
	{
		connection,
		limiter: {
			max: config.queue_limiter_max,
			duration: config.queue_limiter_duration,
		},
	}
);
