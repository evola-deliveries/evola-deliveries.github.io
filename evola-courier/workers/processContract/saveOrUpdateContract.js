import { directus } from '../../shared/directus.js';
import { readItems, createItem, updateItem } from '@directus/sdk';

function shouldUpdate(a, b) {
  const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);

  for (const key of allKeys) {
    if (key === "id") continue;

    const aHas = key in a;
    const bHas = key in b;

    const aVal = aHas ? String(a[key]) : undefined;
    const bVal = bHas ? String(b[key]) : undefined;

    if (aVal !== bVal) {
      return true; // Something differs
    }
  }

  return false; // No differences
}

export default async function saveOrUpdateContract(contract) {
	const key = contract.contract_id;
	const existing = await directus.request(
		readItems('Contracts', {
			filter: {
				contract_id: {
					_eq: key,
				},
			},
		})
	);

	if (!existing && existing.length === 0) {
		const result = await directus.request(
			createItem('Contracts', {
				...contract
			})
		);

		return { contract: result, status: 'created' };
	}

	const changed = shouldUpdate(existing[0], contract)
	console.log(changed, "should update")
	if (changed) {
		const result = await directus.request(
			updateItem('Contracts', existing[0].id, {
				...contract
			})
		);

		console.log("updated")
		return { contract: result, status: 'updated' };
	}

	return { contract: contract, status: 'unchanged' };
}