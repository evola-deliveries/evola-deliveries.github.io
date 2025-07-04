// dispatcher/routes/corporation.js
import express from 'express';
import { createFrameMeta } from '../../../shared/utils/createEventPayload.js';
import { logWithMeta } from '../../../shared/utils/logWithMeta.js';
import { sendCorporationToQueue } from './send-corporation.js';

const router = express.Router();

router.post('/', async (req, res) => {
	const __currentMeta = createFrameMeta();
	const { corporation_id } = req.body;

	if (!corporation_id) {
		return res.status(400).send({ error: 'Missing corporation_id' });
	}

	try {
		await sendCorporationToQueue(corporation_id, __currentMeta);
		logWithMeta('log', __currentMeta, `[Dispatcher API] Corporation ${corporation_id} queued.`);
		res.status(202).send({ status: 'queued', corporation_id });
	} catch (err) {
		logWithMeta('error', __currentMeta, '[QUEUE ERROR]', err);
		res.status(500).send({ error: 'Failed to queue corporation' });
	}
});

export default router;
