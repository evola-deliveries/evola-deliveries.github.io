import evolaConfig from '../../shared/config.js';

const config = {
    process_everything: String(process.env.FETCH_CONTRACTS_PROCESS_EVERYTHING).toLowerCase() === 'true',
    change_interval_seconds: parseInt(process.env.FETCH_CONTRACTS_CHANGE_INTERVAL_SECONDS || '86400', 10),
    ...evolaConfig
}

export default config;