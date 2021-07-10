import React, { useEffect, useState } from 'react';
import PackageDetails from '../package-details';
import OrderTicket from '../order-ticket';
import DataService from '../../services/data-service';
import HeroWelcome from '../hero-welcome';

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
    }, [inboundValue]);

    const handleOutboundChanged = (event) => setOutboundValue(event.target.value);
    const handleInboundChanged = (event) => setInboundValue(event.target.value);

    const [inboundRoute, setInboundRoute] = useState();

    useEffect(() => {
        setPricing(calculatePricing(inboundRoute, pricing.price, pricing.volume, pricing.janice));
    }, [inboundRoute]);

    const [outboundRoute, setOutboundRoute] = useState();

    const handlePricingChange = (price, volume, janice) => {
        setPricing(calculatePricing(inboundRoute, price, volume, janice));
    };

    return (
        <div className="flex flex-wrap -mx-1 overflow-hidden sm:-mx-1 md:-mx-1 lg:-mx-1 xl:-mx-1">
            <div className="my-1 px-1 w-full overflow-hidden">
                <HeroWelcome />
            </div>
            <div className="my-1 px-1 w-full overflow-hidden sm:my-1 sm:px-1 sm:w-1/2 md:my-1 md:px-1 md:w-1/2 lg:my-1 lg:px-1 lg:w-1/2 xl:my-1 xl:px-1 xl:w-1/2">
                <div className="shadow-lg rounded-lg bg-white px-2 py-2">
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
                    <PackageDetails system={inboundRoute} onPricingChange={handlePricingChange} />
                </div>
            </div>
            <div className="my-1 px-1 w-full overflow-hidden sm:my-1 sm:px-1 sm:w-1/2 md:my-1 md:px-1 md:w-1/2 lg:my-1 lg:px-1 lg:w-1/2 xl:my-1 xl:px-1 xl:w-1/2">
                <div className="shadow-lg rounded-lg bg-gray-600 flex justify-center w-full">
                    <OrderTicket outbound={outboundRoute} inbound={inboundRoute} pricing={pricing} />
                </div>
            </div>
        </div>
    );
};