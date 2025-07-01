import { directus } from '../../shared/directus.js';
import { readItems, createItem } from '@directus/sdk';

export default async function saveMember(contract) {
	const key = contract.issuer_corporation_id;

	const result = await directus.request(
		readItems('Corporation', {
			filter: {
				corporation_id: {
					_eq: key,
				},
			},
		})
	);

	const existing = Array.isArray(result) && result.length != 0 ? result[0] : null;

	if (!existing) {
		const created = await directus.request(
			createItem('Corporation', {
				corporation_id: key
			})
		);

		return { corporation: created, status: 'created' };
	}
	
	return { corporation: existing, status: 'unchanged' };
}
