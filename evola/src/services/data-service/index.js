import Config from '../config-service';
import { find } from 'lodash';

const service = {
    async getData() {
        const fetchConfig = {
            method: 'GET',
            cache: 'no-cache',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain',
                'accept': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        };

        const data = await fetch(`${Config.evola_api_root_url}/routes`, fetchConfig).then(response => {
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            return response.json();
        });

        // Safety: if anything in default is null/invalid, use the hard-coded default
        const fallbackDefault = {
            region: "The Forge",
            system: "Jita",
            fees: {
                rushFeeAmount: 150000000
            }
        };

        const d = data.default || {};
        const hasValidRegion = d.region != null && d.region !== "";
        const hasValidSystem = d.system != null && d.system !== "";
        const hasValidFees = d.fees && d.fees.rushFeeAmount != null && d.fees.rushFeeAmount !== "";

        if (!hasValidRegion || !hasValidSystem || !hasValidFees) {
            data.default = fallbackDefault;
        }

        return data;
    },

    getRoutes(data, outbound) {
        if (!data || !data.routes || !outbound) return [];

        const [regionName, systemName] = outbound.split('|');

        const region = find(data.routes, value => value.region === regionName);
        if (!region || !region.systems) return [];

        const system = find(region.systems, value => value.system === systemName);
        if (!system || !system.regions) return [];

        return system.regions;
    },

    getInboundRoute(data, outbound, inbound) {
        if (!data || !data.routes) return;
        if (!outbound || !inbound) return;

        const [outboundRegionName, outboundSystemName] = outbound.split('|');
        const [inboundRegionName, inboundSystemName] = inbound.split('|');

        const outboundRegion = find(data.routes, value => value.region === outboundRegionName);
        if (!outboundRegion || !outboundRegion.systems) return;

        const outboundSystem = find(outboundRegion.systems, value => value.system === outboundSystemName);
        if (!outboundSystem || !outboundSystem.regions) return;

        const inboundRegion = find(outboundSystem.regions, value => value.region === inboundRegionName);
        if (!inboundRegion || !inboundRegion.systems) return;

        const inboundSystem = find(inboundRegion.systems, value => value.system === inboundSystemName);

        return inboundSystem;
    },

    getOutboundRoute(data, outbound) {
        if (!data || !data.routes || !outbound) return;

        const [regionName, systemName] = outbound.split('|');

        const region = find(data.routes, value => value.region === regionName);
        if (!region || !region.systems) return;

        const system = find(region.systems, value => value.system === systemName);

        return system;
    }
};

export default service;
