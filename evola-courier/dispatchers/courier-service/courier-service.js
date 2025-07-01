// dispatcher/server.js
import express from 'express';
import { sendContractToQueue } from './send-contract.js';
import { sendCorporationToQueue } from './send-corporation.js';
import { sendMemberToQueue } from './send-member.js';

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

app.post('/corporation', async (req, res) => {
  const { corporation_id } = req.body;

  if (!corporation_id) {
    return res.status(400).send({ error: 'Missing corporation_id' });
  }

  try {
    await sendCorporationToQueue(corporation_id);
    console.log(`[Dispatcher API] Corporation ${corporation_id} queued.`);
    res.status(202).send({ status: 'queued', corporation_id });
  } catch (err) {
    console.error('[QUEUE ERROR]', err);
    res.status(500).send({ error: 'Failed to queue corporation' });
  }
});

app.post('/member', async (req, res) => {
  const { character_id } = req.body;

  if (!character_id) {
    return res.status(400).send({ error: 'Missing character_id' });
  }

  try {
    await sendMemberToQueue(character_id);
    console.log(`[Dispatcher API] Member ${character_id} queued.`);
    res.status(202).send({ status: 'queued', character_id });
  } catch (err) {
    console.error('[QUEUE ERROR]', err);
    res.status(500).send({ error: 'Failed to queue corporation' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[Dispatcher API] Listening on port ${port}`);
});
