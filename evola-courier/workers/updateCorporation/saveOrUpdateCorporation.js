import { directus } from '../../shared/directus.js';
import { readItems, createItem, updateItem } from '@directus/sdk';

function shouldUpdate(existing, incoming) {
    const ignoredKeys = ['id', 'corporation_id', 'description'];

    for (const key of Object.keys(incoming)) {
        if (ignoredKeys.includes(key)) continue;

        if (!(key in existing)) return true;

        const existingVal = existing[key];
        const incomingVal = incoming[key];

        // Convert both to string for loose comparison
        if (String(existingVal ?? '') !== String(incomingVal ?? '')) {
            return true;
        }
    }

    return false;
}

export default async function saveOrUpdateCorporation(corpData) {
    const key = corpData.corporation_id;

    // Remove ignored fields before sending to Directus
    const sanitized = Object.fromEntries(
        Object.entries(corpData).filter(([key]) => !['description'].includes(key))
    );

    const result = await directus.request(
        readItems('Corporation', {
            filter: {
                corporation_id: { _eq: key }
            }
        })
    );

    const existing = Array.isArray(result) && result.length > 0 ? result[0] : null;

    if (!existing) {
        const created = await directus.request(
            createItem('Corporation', {
                ...sanitized
            })
        );

        return { corporation: created, status: 'created' };
    }

    const changed = shouldUpdate(existing, sanitized);

    if (changed) {
        const updated = await directus.request(
            updateItem('Corporation', existing.id, {
                ...sanitized
            })
        );

        return { old: existing, new: updated, status: 'updated' };
    }

    return { corporation: existing, status: 'unchanged' };
}
