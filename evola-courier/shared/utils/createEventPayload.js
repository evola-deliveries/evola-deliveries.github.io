// shared/utils/createEventPayload.js
import { v4 as uuidv4 } from 'uuid';

export function createFrameMeta(parentMeta = {}) {
	return {
		requestId: uuidv4(),
		correlationId: parentMeta?.correlationId || uuidv4(),
		causationId: parentMeta?.requestId || uuidv4(),
		timestamp: new Date().toISOString(),
	};
}

/**
 * Creates a new event payload with propagated metadata.
 * @param {any} data - Business payload
 * @param {object} parentMeta - Optional previous metadata to chain
 */
export function createEventPayload(data = {}, currentMeta = {}) {
	return {
		__meta: currentMeta || createFrameMeta(),
		payload: data
	};
}