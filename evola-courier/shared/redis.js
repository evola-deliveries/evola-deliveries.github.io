import IORedis from 'ioredis';
import config from './config.js';

const connection = new IORedis({
  host: config.redis_host,
  port: config.redis_port,
  maxRetriesPerRequest: null
});

export default connection;