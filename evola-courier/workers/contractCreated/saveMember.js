import { directus } from '../../shared/directus.js';
import { readItems, createItem } from '@directus/sdk';

export default async function saveMember(contract) {
	const key = contract.issuer_id;

	const result = await directus.request(
		readItems('Member', {
			filter: {
				character_id: {
					_eq: key,
				},
			},
		})
	);

	const existing = Array.isArray(result) && result.length != 0 ? result[0] : null;

	if (!existing) {
		const created = await directus.request(
			createItem('Member', {
				character_id: key
			})
		);

		return { member: created, status: 'created' };
	}
	
	return { member: existing, status: 'unchanged' };
}
