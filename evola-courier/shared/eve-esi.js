// shared/eve-esi.js
import fetch from 'node-fetch';
import config from './config.js';

class EveESIClient {
  constructor({ clientId, clientSecret, refreshToken }) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
    this.accessToken = null;
  }

  async refreshAccessToken() {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const res = await fetch('https://login.eveonline.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.access_token) {
      console.error('[EVE ESI] Failed to refresh token:', res.status, data);
      throw new Error('Failed to refresh ESI token');
    }

    this.accessToken = data.access_token;
    console.log('[EVE ESI] Access token refreshed.');
  }

  async fetchESI(url, attempt = 0) {
    if (!this.accessToken) await this.refreshAccessToken();

    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 401 && attempt < 1) {
      console.warn('[EVE ESI] Token expired. Refreshing and retrying...');
      await this.refreshAccessToken();
      return this.fetchESI(url, attempt + 1);
    }

    if (!res.ok) {
      const body = await res.text();
      console.error(`[EVE ESI] Error ${res.status} on ${url}`, body);
      throw new Error(`ESI error: ${res.status}`);
    }

    const json = await res.json();
    const pages = parseInt(res.headers.get('x-pages') || '1', 10);

    return { data: json, pages };
  }

  async fetchAllContracts(corpId) {
    const contracts = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const { data, pages } = await this.fetchESI(
        `https://esi.evetech.net/latest/corporations/${corpId}/contracts/?datasource=tranquility&page=${page}`
      );

      contracts.push(...data);
      totalPages = pages;
      page++;
    }

    return contracts;
  }
}

export const eveClient = new EveESIClient({
  clientId: config.eve_esi_client_id,
  clientSecret: config.eve_esi_client_secret,
  refreshToken: config.eve_esi_refresh_token
});
