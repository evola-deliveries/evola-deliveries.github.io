import evolaConfig from '../../shared/config.js';

const config = {
    process_everything: process.env.PROCESS_EVERYTHING,
    change_interval_seconds: process.env.CHANGE_INTERVAL_SECONDS,
    ...evolaConfig
}

export default config;