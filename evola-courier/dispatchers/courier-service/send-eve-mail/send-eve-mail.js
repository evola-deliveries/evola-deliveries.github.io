import { readItems } from '@directus/sdk';
import express from 'express';
import { directus } from '../../../shared/directus.js';
import { sendEveMail } from '../../../shared/queue.js';
import { createEventPayload, createFrameMeta } from '../../../shared/utils/createEventPayload.js';
import { logWithMeta } from '../../../shared/utils/logWithMeta.js';

const router = express.Router();

router.post('/', async (req, res) => {
	const { contracts = [] } = req.body;
	const __meta = createFrameMeta();

	if (!contracts.length) {
		logWithMeta('warn', __meta, `[send-eve-mail] No contracts provided.`);
		return res.status(400).json({ error: 'No contract_ids provided.' });
	}

	logWithMeta('log', __meta, `[send-eve-mail] Received request to queue ${contracts.length} contract(s).`);

	let queued = 0;
	let failed = [];

	// Fetch contracts from Directus
	let retrieved;
	try {
		retrieved = await directus.request(readItems('Contracts', {
			filter: { contract_id: { _in: contracts.map(m => m.contract_id) } }
		}));
	} catch (err) {
		logWithMeta('error', __meta, `[send-eve-mail] Failed to fetch contracts from Directus`, err);
		return res.status(500).json({ error: 'Failed to retrieve contracts.' });
	}

	for (const contract of retrieved) {
		const payload = createEventPayload(contract, __meta);

		try {
			await sendEveMail.add('process', payload, {
				jobId: `retry-mail-${contract.contract_id}`,
				attempts: 3,
				backoff: { type: 'exponential', delay: 2000 },
				removeOnComplete: true,
				removeOnFail: true,
			});

			logWithMeta('log', __meta, `[send-eve-mail] Queued contract ${contract.contract_id}`);
			queued++;
		} catch (err) {
			logWithMeta('error', __meta, `[send-eve-mail] Failed to queue contract ${contract.contract_id}`, err);
			failed.push(contract.contract_id);
		}
	}

	logWithMeta('log', __meta, `[send-eve-mail] Queue complete. Success: ${queued}, Failed: ${failed.length}`);

	return res.json({
		success: true,
		queued,
		failed
	});
});

export default router;
