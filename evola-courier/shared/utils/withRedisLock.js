// shared/utils/withRedisLock.js
import connection from '../redis.js';

export async function withRedisLock(key, ttlSeconds, callback) {
	const token = `token-lock-${Date.now()}-${Math.random()}`;
	const acquired = await connection.set(key, token, 'NX', 'EX', ttlSeconds);

	if (!acquired) {
		console.log(`[withRedisLock] Lock already held for ${key}, skipping.`);
		return false; // lock not acquired
	}

	try {
		await callback();
		return true;
	} catch (err) {
		throw err;
	} finally {
		// Ensure only the holder of the lock can release it
		const lua = `
      if redis.call("get", KEYS[1]) == ARGV[1]
      then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
		await connection.eval(lua, 1, key, token);
	}
}
