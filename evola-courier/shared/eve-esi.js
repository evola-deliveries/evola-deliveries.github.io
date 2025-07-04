// shared/eve-esi.js
import fetch from 'node-fetch';
import config from './config.js';

class EveESIClient {
	constructor({ clientId, clientSecret, refreshToken }) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.refreshToken = refreshToken;
		this.accessToken = null;

		const uaParts = [
			config.esi_user_agent_app,
			`(${config.esi_user_agent_email})`,
			config.esi_user_agent_source,
			config.esi_user_agent_discord,
			`(${config.esi_user_agent_eve})`,
		].filter(Boolean); // only keep non-null

		this.userAgent = uaParts.join(' ');
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
				'User-Agent': this.userAgent
			}
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

	async getCorporationInfo(corpId) {
		const { data } = await this.fetchESI(`https://esi.evetech.net/latest/corporations/${corpId}/?datasource=tranquility`);
		return data;
	}

	async getCharacterInfo(characterId) {
		const { data } = await this.fetchESI(`https://esi.evetech.net/latest/characters/${characterId}/?datasource=tranquility`);
		return data;
	}

	async getStationInfo(stationId) {
		const { data } = await this.fetchESI(`https://esi.evetech.net/latest/universe/stations/${stationId}/?datasource=tranquility`);
		return data;
	}

	async getRoute(fromSystemId, toSystemId, flag = 'shortest') {
		const { data } = await this.fetchESI(`https://esi.evetech.net/latest/route/${fromSystemId}/${toSystemId}/?datasource=tranquility&flag=${flag}`);
		return data;
	}

	async sendMail(characterId, { recipients, subject, body, approved_cost = 0 }, attempt = 0) {
		if (!this.accessToken) await this.refreshAccessToken();

		const url = `https://esi.evetech.net/latest/characters/${characterId}/mail/?datasource=tranquility`;

		const payload = {
			approved_cost,
			body,
			recipients,
			subject
		};

		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${this.accessToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		const text = await res.text();
		let data;
		try {
			data = JSON.parse(text);
		} catch {
			data = { error: text };
		}

		// Success
		if (res.status === 201) {
			const mailId = parseInt(text);
			console.log(`[EVE ESI] Mail sent: ID ${mailId}`);
			return { status: 'sent', mailId };
		}

		// Token expired
		if (res.status === 401 && attempt < 1) {
			console.warn('[EVE ESI] Unauthorized — retrying after refreshing token');
			await this.refreshAccessToken();
			return this.sendMail(characterId, { recipients, subject, body, approved_cost }, attempt + 1);
		}

		// Rate-limited
		if (res.status === 420) {
			console.warn(`[EVE ESI] Rate limited on sendMail for ${characterId}`, data);
			return { status: 'rate_limited', retryAfter: 30 };
		}

		// Fatal (no retry)
		if ([400, 403].includes(res.status)) {
			console.error(`[EVE ESI] Mail failed for ${characterId}. Status ${res.status}`, data);
			return { status: 'failed', error: data.error || 'Bad request/Forbidden' };
		}

		// Transient (retry via BullMQ)
		if (res.status >= 500 || res.status === 520) {
			console.error(`[EVE ESI] Server error (${res.status}) for ${characterId}`, data);
			throw new Error(`ServerError: ${res.status}`);
		}

		// Unknown response
		console.error(`[EVE ESI] Unexpected mail response for ${characterId}: ${res.status}`, data);
		throw new Error(`Unhandled ESI response: ${res.status}`);
	}
}

export const eveClient = new EveESIClient({
	clientId: config.eve_esi_client_id,
	clientSecret: config.eve_esi_client_secret,
	refreshToken: config.eve_esi_refresh_token
});
