import { directus } from '../../shared/directus.js';
import { readItems, updateItem } from '@directus/sdk';
import { eveClient } from '../../shared/eve-esi.js';
import config from './config.js';

export default async function sendEveMailIfRequired(contract) {
	const { contract_id, issuer_id, start_location_id, status } = contract;

	// Only proceed if status is "finished"
	if (status !== 'finished') {
		console.warn(`[sendEveMailIfRequired] Contract ${contract_id} has status "${status}", not "finished". Skipping.`);
		return { status: 'not_finished' };
	}

	// Lookup contract in Directus
	const existing = await directus.request(
		readItems('Contracts', {
			filter: { contract_id: { _eq: contract_id } }
		})
	);

	if (!existing?.length) {
		console.warn(`[sendEveMailIfRequired] Contract ${contract_id} not found in Directus.`);
		return { status: 'not_found' };
	}

	const record = existing[0];

	if (record.mail_sent) {
		console.log(`[sendEveMailIfRequired] Mail already sent for contract ${contract_id}`);
		return { status: 'already_sent' };
	}

	if (record.mail_attempted) {
		console.warn(`[sendEveMailIfRequired] Mail already attempted for contract ${contract_id}, skipping.`);
		return { status: 'already_attempted' };
	}

	// Try to send the mail
	let result;
	let markAttempt = true;
	try {
		result = await eveClient.sendMail(config.evola_eve_character_id, {
			recipients: [{
				recipient_type: 'character',
				recipient_id: config.override_recipient_character_id || issuer_id
			}],
			subject: 'Your Delivery',
			body: `Your <url=contract:${start_location_id}//${contract_id}>package</url> has been delivered. Thank you for using Evola Deliveries. If you enjoyed our service, remember to check us out on <url=https://discord.gg/ZGt6eUwuXt>Discord</url> and <url=https://www.pandemic-horde.org/forum/index.php?threads/evola-deliveries-horde-courier-service.3266/>our forum post</url> for updated pricing and route status. -Evola`
		});
	} catch (err) {
		const message = err.message || '';
		if (message.includes('MailStopSpamming') && message.includes('remainingTime')) {
			markAttempt = false;
			const match = message.match(/"remainingTime"\s*:\s*(\d+)/);
			const retryAfter = match ? parseInt(match[1], 10) : 10 * 60 * 1000;
			console.warn(`[sendEveMailIfRequired] Spamming detected, delaying for ${retryAfter}ms`);
			return { status: 'rate_limited', retryAfter };
		}

		throw err;
	}
	finally {
		if (markAttempt) {
			// Mail sent successfully, now mark attempted + sent
			const attemptRes = await directus.request(
				updateItem('Contracts', record.id, { mail_attempted: true }, { fields: ['id'] })
			);

			if (attemptRes?.id !== record.id) {
				throw new Error(`[sendEveMailIfRequired] Mismatch in mail_attempted update ID for contract ${contract_id}`);
			}
		}
	}

	const sentRes = await directus.request(
		updateItem('Contracts', record.id, { mail_sent: true }, { fields: ['id'] })
	);

	if (sentRes?.id !== record.id) {
		throw new Error(`[sendEveMailIfRequired] Mismatch in mail_sent update ID for contract ${contract_id}`);
	}

	return { status: 'sent', mailId: result.mailId };
}
