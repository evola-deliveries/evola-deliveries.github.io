// shared/utils/createEventPayload.js
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a new event payload with propagated metadata.
 * @param {any} data - Business payload
 * @param {object} parentMeta - Optional previous metadata to chain
 */
export function createEventPayload(data = {}, parentMeta = {}) {
	const {
		requestId = uuidv4(), // new unit of work
		correlationId = uuidv4(), // shared across a chain
		causationId = parentMeta?.requestId || uuidv4(), // cause of *this* event
		meta = {}
	} = parentMeta;

	return {
		__meta: {
			requestId, // new on each step
			correlationId, // passed from previous
			causationId, // previous step's requestId
			timestamp: new Date().toISOString(),
			...meta,
		},
		payload: data
	};
}
