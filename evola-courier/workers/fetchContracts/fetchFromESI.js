import { eveClient } from '../../shared/eve-esi.js';
import config from './config.js';

export default async function fetchFromESI() {
  const fetched = await eveClient.fetchAllContracts(config.evola_eve_corporation_id);
	if (!Array.isArray(fetched)) return [];

	const courierContracts = fetched.filter(c => c.type === 'courier');

  return courierContracts;
}