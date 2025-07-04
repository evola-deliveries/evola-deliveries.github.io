import evolaConfig from '../../shared/config.js';

const config = {
    trigger_fetch_cron: process.env.TRIGGER_FETCH_CRON?.trim(),

    ...evolaConfig
}

export default config;