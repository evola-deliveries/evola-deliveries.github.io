import { eveClient } from '../../shared/eve-esi.js';
import config from './config.js';

const DATE_FIELDS = [
  'date_accepted',
  'date_completed',
  'date_expired',
  'date_issued'
];

function hasRecentChange(contract, sinceTime) {
  return DATE_FIELDS.some(field => {
    if (!contract[field]) return false;
    const time = new Date(contract[field]).getTime();
    return time >= sinceTime;
  });
}

export default async function fetchFromESI() {
  const fetched = await eveClient.fetchAllContracts(config.evola_eve_corporation_id);
  if (!Array.isArray(fetched)) return [];

  const courierContracts = fetched.filter(c => c.type === 'courier');

  if (config.process_everything) {
    console.log(`[ESI] process_everything is true – returning ${courierContracts.length} courier contracts.`);
    return courierContracts;
  }

  const now = Date.now();
  const threshold = now - (config.change_interval_seconds || 86400) * 1000;

  const changedContracts = courierContracts.filter(c => hasRecentChange(c, threshold));

  console.log(`[ESI] process_everything is false – returning ${changedContracts.length} changed courier contracts.`);
  return changedContracts;
}
