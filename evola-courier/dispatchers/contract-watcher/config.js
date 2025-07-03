import evolaConfig from '../../shared/config.js';

const config = {
    check_interval: process.env.CONTRACT_WATCHER_CHECK_INTERVAL,
    redis_key: process.env.CONTRACT_WATCHER_REDIS_KEY,
    ...evolaConfig
}

export default config;