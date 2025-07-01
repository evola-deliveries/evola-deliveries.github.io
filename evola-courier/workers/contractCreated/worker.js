import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';
import saveMember from './saveMember.js';
import saveCorporation from './saveCorporation.js';
import { memberCreated, corporationCreated } from '../../shared/queue.js';

new Worker('contractCreated', async job => {
	console.log(`[contractCreated] Contract ${job.data.contract_id} created.`);
	// simulate API call or webhook

	const contract = job.data;
	
	try {
		const memberResult = await saveMember(contract);
		console.log(`[contractCreated] Member ${memberResult.member.character_id} status ${memberResult.status}.`);
		if(memberResult.status === 'created') await memberCreated.add('created', memberResult.member);
	} catch (ex) {
		console.log(ex);
		throw new Error();
	}
	
	try {
		const corporationResult = await saveCorporation(contract);
		console.log(`[contractCreated] Corporation ${corporationResult.corporation.corporation_id} status ${corporationResult.status}.`);
		if(corporationResult.status === 'created') await corporationCreated.add('created', corporationResult.corporation);
	} catch (ex) {
		console.log(ex);
		throw new Error();
	}
}, { connection });