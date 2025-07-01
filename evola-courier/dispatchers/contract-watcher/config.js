import evolaConfig from '../../shared/config.js';

const config = {
    check_interval: process.env.CHECK_INTERVAL,
    redis_key: process.env.REDIS_KEY,
    ...evolaConfig
}

export default config;