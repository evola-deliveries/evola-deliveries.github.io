import { directus } from '../../shared/directus.js';
import { readItems, createItem, updateItem } from '@directus/sdk';

function shouldUpdate(existing, incoming) {
    const ignoredKeys = ['id', 'character_id', 'description'];

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

export default async function saveOrUpdateMember(memberData) {
    const key = memberData.character_id;

    // Remove ignored fields before sending to Directus
    const sanitized = Object.fromEntries(
        Object.entries(memberData).filter(([key]) => !['description'].includes(key))
    );

    const result = await directus.request(
        readItems('Member', {
            filter: {
                character_id: { _eq: key }
            }
        })
    );

    const existing = Array.isArray(result) && result.length > 0 ? result[0] : null;

    if (!existing) {
        const created = await directus.request(
            createItem('Member', {
                ...sanitized
            })
        );

        return { member: created, status: 'created' };
    }

    const changed = shouldUpdate(existing, sanitized);

    if (changed) {
        const updated = await directus.request(
            updateItem('Member', existing.id, {
                ...sanitized
            })
        );

        return { old: existing, new: updated, status: 'updated' };
    }

    return { member: existing, status: 'unchanged' };
}
