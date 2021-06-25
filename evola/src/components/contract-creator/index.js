import React, { useEffect, useState } from 'react';
import { find }from 'lodash';
import data from '../../data/routes';

function outboundSelected(outbound, data) {
    const route = outbound;
    const regionName = route.split('|')[0];
    const systemName = route.split('|')[1];

    const region = find(data, (value) => value.region === regionName);
    const system = find(region.systems, (value) => value.system === systemName);

    return system.regions;
}

export default function ContractCreator() {
    const routes = data.routes;
    const [outboundValue, setOutboundValue] = useState(routes[0].region + "|" + routes[0].systems[0].system);
    const [inboundValue, setInboundValue] = useState("");

    return (
        <div>
            <select name="outbound" value={outboundValue} onChange={(event) => setOutboundValue(event.target.value)} >
                {routes.map(route => (
                    <optgroup key={route.region} label={route.region}>
                        {route.systems.map(system => (
                            <option value={route.region + "|" + system.system}>{system.system}</option>
                        ))}
                    </optgroup>
                ))}
            </select>
            <select name="inbound" value={inboundValue} onChange={(event) => setInboundValue(event.target.value)} >
                {outboundSelected(outboundValue, routes).map(route => (
                    <optgroup key={route.region} label={route.region}>
                        {route.systems.map(system => (
                            <option value={route.region + "|" + system.system}>{system.system}</option>
                        ))}
                    </optgroup>
                ))}
            </select>
        </div>
    );
};