// dispatcher/server.js
import express from 'express';
import { sendContractToQueue } from './send-contract.js';

const app = express();
app.use(express.json());

app.post('/contract', async (req, res) => {
  const contract = req.body;

  if (!contract || !contract.contract_id) {
    return res.status(400).send({ error: 'Missing contract data or contract_id' });
  }

  try {
    await sendContractToQueue(contract);
    console.log(`[Dispatcher API] Contract ${contract.contract_id} queued.`);
    res.status(202).send({ status: 'queued', contract_id: contract.contract_id });
  } catch (err) {
    console.error('[QUEUE ERROR]', err);
    res.status(500).send({ error: 'Failed to queue contract' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[Dispatcher API] Listening on port ${port}`);
});
