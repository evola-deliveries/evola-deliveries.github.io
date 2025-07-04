// dispatcher/routes/contract.js
import express from 'express';
import { createFrameMeta } from '../../../shared/utils/createEventPayload.js';
import { logWithMeta } from '../../../shared/utils/logWithMeta.js';
import { sendContractToQueue } from './send-contract.js';

const router = express.Router();

router.post('/', async (req, res) => {
	const __currentMeta = createFrameMeta();
	const contract = req.body;

	if (!contract || !contract.contract_id) {
		return res.status(400).send({ error: 'Missing contract data or contract_id' });
	}

	try {
		await sendContractToQueue(contract, __currentMeta);
		logWithMeta('log', __currentMeta, `[Dispatcher API] Contract ${contract.contract_id} queued.`);
		res.status(202).send({ status: 'queued', contract_id: contract.contract_id });
	} catch (err) {
		logWithMeta('error', __currentMeta, '[QUEUE ERROR]', err);
		res.status(500).send({ error: 'Failed to queue contract' });
	}
});

export default router;
