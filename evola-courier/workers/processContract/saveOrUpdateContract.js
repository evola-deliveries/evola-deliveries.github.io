import { directus } from '../../shared/directus.js';
import { readItems, createItem, updateItem } from '@directus/sdk';

function shouldUpdate(existing, incoming) {
	const ignoredKeys = ['id', 'mail_sent'];

    for (const key of Object.keys(incoming)) {
        if (ignoredKeys.includes(key)) continue;

		const aHas = key in existing;

		// if new field
		if (!aHas) return true;

		const aVal = String(existing[key]);
		const bVal = String(incoming[key]);

		if (aVal !== bVal) return true;
	}

	return false;
}

export default async function saveOrUpdateContract(contract) {
	const key = contract.contract_id;

	const result = await directus.request(
		readItems('Contracts', {
			filter: {
				contract_id: {
					_eq: key,
				},
			},
		})
	);

	const existing = Array.isArray(result) && result.length != 0 ? result[0] : null;

	if (!existing) {
		const created = await directus.request(
			createItem('Contracts', {
				...contract
			})
		);

		return { contract: created, status: 'created' };
	}

	const changed = shouldUpdate(existing, contract);

	if (changed) {
		const updated = await directus.request(
			updateItem('Contracts', existing.id, {
				...contract
			})
		);

		return { old: existing, new: updated, status: 'updated' };
	}

	return { contract: existing, status: 'unchanged' };
}
