// dispatcher/routes/member.js
import express from 'express';
import { createFrameMeta } from '../../../shared/utils/createEventPayload.js';
import { logWithMeta } from '../../../shared/utils/logWithMeta.js';
import { sendMemberToQueue } from './send-member.js';

const router = express.Router();

router.post('/', async (req, res) => {
	const __currentMeta = createFrameMeta();
	const { character_id } = req.body;

	if (!character_id) {
		return res.status(400).send({ error: 'Missing character_id' });
	}

	try {
		await sendMemberToQueue(character_id, __currentMeta);
		logWithMeta('log', __currentMeta, `[Dispatcher API] Member ${character_id} queued.`);
		res.status(202).send({ status: 'queued', character_id });
	} catch (err) {
		logWithMeta('error', __currentMeta, '[QUEUE ERROR]', err);
		res.status(500).send({ error: 'Failed to queue member' });
	}
});

export default router;
