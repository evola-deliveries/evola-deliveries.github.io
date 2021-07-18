import React, { useEffect, useState } from 'react';
import PackageDetails from '../package-details';
import OrderTicket from '../order-ticket';
import DataService from '../../services/data-service';
import ConfigService from '../../services/config-service';

function calculatePricing(inboundRouteDeep, price, volume, janice) {
    const volumeIsk = inboundRouteDeep ? Math.ceil(volume * inboundRouteDeep.reward.volume) : 0;
    const collateralIsk = inboundRouteDeep ? Math.ceil((price / 100) * inboundRouteDeep.reward.collateral) : 0;
    const volumeInvalid = inboundRouteDeep ? inboundRouteDeep.limits.volume < volume : false;
    const collateralInvalid = inboundRouteDeep ? inboundRouteDeep.limits.collateral < price : false;
    let total = volumeIsk + collateralIsk;
    if (inboundRouteDeep && total < inboundRouteDeep.minimumReward) total = inboundRouteDeep.minimumReward;

    return {
        price: price,
        volume: volume,
        janice: janice,
        totals: {
            volumeInvalid: volumeInvalid,
            collateralInvalid: collateralInvalid,
            volume: volumeIsk,
            collateral: collateralIsk,
            total: total
        }
    };
}

export default function ContractCreator() {
    const [pricing, setPricing] = useState(calculatePricing(null, 0, 0, ""));

    const [outboundValue, setOutboundValue] = useState(DataService.default.region + "|" + DataService.default.system);

    useEffect(() => {
        setOutboundRoute(DataService.getOutboundRoute(outboundValue));
    }, [outboundValue]);

    const [inboundValue, setInboundValue] = useState("");

    useEffect(() => {
        setInboundRoute(DataService.getInboundRoute(outboundValue, inboundValue));
    }, [inboundValue]); // eslint-disable-line react-hooks/exhaustive-deps
    // TODO fix this

    const handleOutboundChanged = (event) => setOutboundValue(event.target.value);
    const handleInboundChanged = (event) => setInboundValue(event.target.value);

    const [inboundRoute, setInboundRoute] = useState();

    useEffect(() => {
        setPricing(calculatePricing(inboundRoute, pricing.price, pricing.volume, pricing.janice));
    }, [inboundRoute]); // eslint-disable-line react-hooks/exhaustive-deps

    const [outboundRoute, setOutboundRoute] = useState();

    const handlePricingChange = (price, volume, janice) => {
        setPricing(calculatePricing(inboundRoute, price, volume, janice));
    };

    return (
        <div className="flex flex-wrap -mx-1 overflow-hidden sm:-mx-1 md:-mx-1 lg:-mx-1 xl:-mx-1">
            <div className="my-1 px-1 w-full overflow-hidden sm:my-1 sm:px-1 sm:w-1/2 md:my-1 md:px-1 md:w-1/2 lg:my-1 lg:px-1 lg:w-1/2 xl:my-1 xl:px-1 xl:w-1/2">
                <div className="shadow-lg rounded-lg bg-white px-2 py-2">
                    <div className="my-2">
                        <h4 class="md:block text-xl text-gray-400">WELCOME TO</h4>
                        <h3 class="md:block font-bold text-2xl text-gray-700">EVOLA DELIVERIES</h3>
                        <p class="text-gray-600 text-justify">
                            Contracts are issued directly to <span className="select-all">Evola Deliveries</span> Corporation.
                            If you wish to use our services for a route that is currently not supported please contact <span className="font-bold">Nahtsu</span> directly.
                            If you have any feedback please let us know!
                        </p>
                        <a class="flex items-baseline mt-3 text-blue-600 hover:text-blue-900 focus:text-blue-900" href={ConfigService.discord_url} target="_blank" rel="noreferrer">
                            <span>Join Discord</span>
                            <span class="text-xs ml-1">&#x279c;</span>
                        </a>
                    </div>
                    <hr />
                    <h2 className="w-full font-bold text-xl">Contract Creator</h2>
                    <h3 className="w-full font-bold text-gl">Select the outbound and inbound</h3>
                    <div className="flex justify-between">
                        <label htmlFor="outbound">Outbound:</label>
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
                    </div>
                    <div className="flex justify-between my-2 border-b-2 border-dashed border-green-700">
                        <label>Station (from):</label>
                        <span className="select-all mx-2">{outboundRoute && outboundRoute.station}</span>
                    </div>
                    <div className="flex justify-between">
                        <label htmlFor="inbound">Inbound:</label>
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
                    </div>
                    <div className="flex justify-between my-2 border-b-2 border-dashed border-green-700">
                        <label>Station (to):</label>
                        <span className="select-all mx-2">{inboundRoute && inboundRoute.station}</span>
                    </div>
                    <PackageDetails system={inboundRoute} onPricingChange={handlePricingChange} />
                </div>
            </div>
            <div className="my-1 px-1 w-full overflow-hidden sm:my-1 sm:px-1 sm:w-1/2 md:my-1 md:px-1 md:w-1/2 lg:my-1 lg:px-1 lg:w-1/2 xl:my-1 xl:px-1 xl:w-1/2">
                <div className="flex justify-center w-full">
                    <OrderTicket outbound={outboundRoute} inbound={inboundRoute} pricing={pricing} />
                </div>
            </div>
        </div>
    );
};