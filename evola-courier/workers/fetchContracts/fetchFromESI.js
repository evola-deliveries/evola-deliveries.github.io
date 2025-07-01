import fetch from 'node-fetch';

export default async function fetchFromESI() {
  const url = 'https://didactic-goldfish-p447vg6gjcr6p9-1880.app.github.dev/corporations/98684131/contracts/';
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'YourAgentNameHere',
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // If needed
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch contracts: ${response.status} ${response.statusText}`);
  }

  const contracts = await response.json();
  return contracts;
}