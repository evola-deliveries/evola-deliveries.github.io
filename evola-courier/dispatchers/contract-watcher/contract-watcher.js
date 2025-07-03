// watcher/index.js
import { setInterval } from 'timers';
import { processContract } from '../../shared/queue.js';
import connection from '../../shared/redis.js';
import { eveClient } from '../../shared/eve-esi.js';
import config from './config.js';
import { createEventPayload } from '../../shared/utils/createEventPayload.js';

const REDIS_KEY = config.redis_key;
const CHECK_INTERVAL = parseInt(config.check_interval || '600');

let inMemoryContracts = new Map();

async function saveContractsToRedis() {
	const raw = JSON.stringify(Object.fromEntries(inMemoryContracts));
	await connection.set(REDIS_KEY, raw);
}

async function loadContractsFromRedis() {
	const raw = await connection.get(REDIS_KEY);
	if (!raw) {
		console.log(`[Redis] No tracked contracts found in Redis.`);
		return;
	}

	try {
		const obj = JSON.parse(raw);
		inMemoryContracts = new Map(Object.entries(obj).map(([k, v]) => [Number(k), v]));
		console.log(`[Redis] Loaded ${inMemoryContracts.size} tracked contract(s) from Redis.`);
	} catch (err) {
		console.error('[Redis Load Error]', err);
	}
}

async function checkForChanges() {
	const fetched = await eveClient.fetchAllContracts(config.evola_eve_corporation_id);
	if (!Array.isArray(fetched)) return;

	const courierContracts = fetched.filter(c => c.type === 'courier');
	const seenIds = new Set();

	// 🌸 Count statuses
	const statusCounts = {};
	for (const c of courierContracts) {
		const status = c.status || 'unknown';
		statusCounts[status] = (statusCounts[status] || 0) + 1;
	}

	console.log(`[ESI] Retrieved ${courierContracts.length} courier contract(s) from ESI.`);
	for (const [status, count] of Object.entries(statusCounts)) {
		console.log(`  └─ ${status}: ${count}`);
	}

	for (const contract of courierContracts) {
		const id = contract.contract_id;
		seenIds.add(id);

		const tracked = inMemoryContracts.get(id);
		const status = contract.status;

		if (!tracked && (status === 'outstanding' || status === 'in_progress')) {
			inMemoryContracts.set(id, contract);
			const newJob = createEventPayload(contract);
			await processContract.add('process', newJob, {
				attempts: 3,
				backoff: { type: 'exponential', delay: 2000 }
			});
			console.log(`[Tracking] New contract ${id}`);
		} else if (tracked && status === 'finished') {
			const newJob = createEventPayload(contract);
			await processContract.add('process', newJob, {
				attempts: 3,
				backoff: { type: 'exponential', delay: 2000 }
			});
			inMemoryContracts.delete(id);
			console.log(`[Completed] Contract ${id} processed and removed.`);
		} else if (tracked && (status !== 'outstanding' && status !== 'in_progress')) {
			inMemoryContracts.delete(id);
			console.log(`[Removed] Contract ${id} is no longer active.`);
		}
	}

	for (const id of inMemoryContracts.keys()) {
		if (!seenIds.has(id)) {
			inMemoryContracts.delete(id);
			console.log(`[Removed] Contract ${id} no longer present in ESI response.`);
		}
	}

	await saveContractsToRedis();
}

async function startWatcher() {
	await loadContractsFromRedis();
	await checkForChanges();
	setInterval(checkForChanges, CHECK_INTERVAL * 1000);
}

startWatcher().catch(err => console.error('[Watcher Error]', err));
