import Data from './data.json';
import { find } from 'lodash';

const service = {
    routes: Data.routes,
    default: Data.default,
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