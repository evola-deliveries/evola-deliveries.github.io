// shared/utils/logWithMeta.js

/**
 * Logs with metadata (requestId, correlationId, causationId)
 * @param {'log' | 'warn' | 'error'} level - console level
 * @param {object} meta - __meta object with trace IDs
 * @param {string} message - Main log message
 * @param {...any} args - Additional data to log
 */
export function logWithMeta(level, meta, message, ...args) {
	const {
		requestId,
		correlationId,
		causationId,
		timestamp = new Date().toISOString(),
	} = meta || {};

	const prefix = `[${timestamp}] [RID:${requestId?.slice(0, 8) || 'N/A'} CID:${correlationId?.slice(0, 8) || 'N/A'} CAU:${causationId?.slice(0, 8) || 'N/A'}]`;

	console[level](`${prefix} ${message}`, ...args);
}
