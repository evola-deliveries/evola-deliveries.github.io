import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import { contractCreated, contractUpdated } from '../../shared/queue.js';
import saveOrUpdateContract from './saveOrUpdateContract.js';

new Worker('processContract', async job => {
	const contract = job.data;

	console.log(`[processContract] Processing Contract ${contract.contract_id}.`);
	let result = { status: null };
	try {
		if (contract.type !== 'courier') {
			result.status = 'ignored'
		} else {
			result = await saveOrUpdateContract(contract);
		}
	} catch (ex) {
		console.log(ex);
		throw new Error();
	}

	console.log(`[processContract] Contract ${contract.contract_id} status ${result.status}.`);

	try {
		if (result.status === 'created') {
			await contractCreated.add('created', result.contract);
		} else if (result.status === 'updated') {
			await contractUpdated.add('updated', { old: result.old, new: result.new });
		}
	} catch (ex) {
		console.log(ex);
		throw new Error();
	}

	console.log(`[processContract] Contract ${contract.contract_id} processed.`);
}, { connection });