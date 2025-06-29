import Data from './data.json';
import Config from '../config-service';
import { find } from 'lodash';

const service = {
    routes: Data.routes,
    default: Data.default,
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

        return await fetch(`${Config.evola_api_root_url}/routes`, fetchConfig).then(response => {
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            return response.json();
        })
    },
    getRoutes(outbound) {
        const regionName = outbound.split('|')[0];
        const systemName = outbound.split('|')[1];
    
        const region = find(this.routes, (value) => value.region === regionName);
        const system = find(region.systems, (value) => value.system === systemName);
    
        return system.regions;
    },
    getInboundRoute(outbound, inbound) {
        if (outbound === "" || outbound === undefined) return;
        if (inbound === "" || inbound === undefined) return;

        const outboundRegionName = outbound.split('|')[0];
        const outboundSystemName = outbound.split('|')[1];

        const inboundRegionName = inbound.split('|')[0];
        const inboundSystemName = inbound.split('|')[1];
    
        const outboundRegion = find(this.routes, (value) => value.region === outboundRegionName);
        const outboundSystem = find(outboundRegion.systems, (value) => value.system === outboundSystemName);

        const inboundRegion = find(outboundSystem.regions, (value) => value.region === inboundRegionName);

        if(!inboundRegion) return;

        const inboundSystem = find(inboundRegion.systems, (value) => value.system === inboundSystemName);

        return inboundSystem;
    },
    getOutboundRoute(outbound) {
        const regionName = outbound.split('|')[0];
        const systemName = outbound.split('|')[1];
    
        const region = find(this.routes, (value) => value.region === regionName);
        const system = find(region.systems, (value) => value.system === systemName);
    
        return system;
    }
};

export default service;