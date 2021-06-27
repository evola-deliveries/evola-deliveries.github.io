import React, { useState } from 'react';
import RouteDetails from '../route-details';
import PackageDetails from '../package-details';
import OrderTicket from '../order-ticket';
import DataService from '../../services/data-service';

export default function ContractCreator() {
    const [outboundValue, setOutboundValue] = useState(DataService.default.region + "|" + DataService.default.system);
    const [inboundValue, setInboundValue] = useState("");

    const handleOutboundChanged = (event) => setOutboundValue(event.target.value);
    const handleInboundChanged = (event) => setInboundValue(event.target.value);

    return (
        <div class="flex justify-between">
            <fieldset>
                <legend>Select the outbound and inbound:</legend>
                <label for="outbound">Outbound:</label>
                <select name="outbound" defaultValue={outboundValue} onChange={handleOutboundChanged} >
                    <option disabled hidden value=''></option>
                    {DataService.routes.map(route => (
                        <optgroup key={route.region} label={route.region}>
                            {route.systems.map(system => (
                                <option value={route.region + "|" + system.system}>{system.system}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>
                <label for="inbound">Inbound:</label>
                <select name="inbound" defaultValue="" onChange={handleInboundChanged} >
                    <option value="">None</option>
                    {DataService.getRoutes(outboundValue).map(route => (
                        <optgroup key={route.region} label={route.region}>
                            {route.systems.map(system => (
                                <option value={route.region + "|" + system.system}>{system.system}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </fieldset>
            <RouteDetails outbound={outboundValue} inbound={inboundValue}/>
            <PackageDetails outbound={outboundValue} inbound={inboundValue}/>
            <OrderTicket />
        </div>
    );
};