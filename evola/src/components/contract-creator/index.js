import React, { useEffect, useState } from 'react';
import PackageDetails from '../package-details';
import OrderTicket from '../order-ticket';
import DataService from '../../services/data-service';
import ConfigService from '../../services/config-service';
import ContractService from "../../services/esi-service";
import UtilsService from "../../services/utils-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from '@fortawesome/free-regular-svg-icons';

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

    const [outstandingContracts, setOutstandingContracts] = useState();
    const [progressContracts, setProgressContracts] = useState();
    const [HundredContracts, setLast100ContractTime] = useState();
    const [MJJitaHundredContracts, setLast100MJJitaContracts] = useState();

    ContractService.getContracts().then(r => {
        setOutstandingContracts(r.Outstanding)
        setProgressContracts(r.InProgress)
        setLast100ContractTime(r.HundredContracts)
        setLast100MJJitaContracts(r.MJJitaHundredContracts)
    }).catch(reason => {
        console.log(reason);
    })

    return (
        <div className="flex flex-wrap -mx-1 overflow-hidden sm:-mx-1 md:-mx-1 lg:-mx-1 xl:-mx-1">
            <div className="my-1 px-1 w-full overflow-hidden sm:my-1 sm:px-1 sm:w-1/2 md:my-1 md:px-1 md:w-1/2 lg:my-1 lg:px-1 lg:w-1/2 xl:my-1 xl:px-1 xl:w-1/2">
                <div className="shadow-lg rounded-lg bg-white px-2 py-2">
                    <div className="my-2">
                        <div className="headerCont">
                            <h4 class="md:block text-2xl text-gray-400">WELCOME TO</h4>
                            <h3 class="md:block font-bold text-3xl text-gray-700">EVOLA DELIVERIES</h3>
                            <a class="flex items-baseline mt-3 text-3xl text-blue-600 hover:text-blue-900 focus:text-blue-900" href={ConfigService.discord_url} target="_blank" rel="noreferrer">
                                <span>Join Discord</span>
                                <span class="text-xl ml-1">&#x279c;</span>
                            </a>
                        </div>
                        <div className="headerCont2">
                            <h4 class="md:block text-2xl text-gray-400">Queue Status:</h4>
                            <h3 class="font-bold text-2xl inLine outstandingColor">{outstandingContracts}</h3>
                            <h3 className="font-bold text-2xl text-gray-700 inLine">&nbsp;Outstanding&nbsp;</h3>
                            <h3 class="font-bold text-2xl inLine inProgressColor">{progressContracts}</h3>
                            <h3 className="font-bold text-2xl text-gray-700 inLine">&nbsp;In Progress</h3>
                            <div>
                                <h4 class="font-bold text-2xl inLine text-gray-700">Average Contract Time:&nbsp;</h4>
                                <h3 class="font-bold text-2xl inLine outstandingColor">{HundredContracts} Hours</h3>
                            </div>
                            <div>
                                <h4 class="font-bold text-2xl inLine text-gray-700">MJ to and from Jita:&nbsp;</h4>
                                <h3 class="font-bold text-2xl inLine outstandingColor">{MJJitaHundredContracts} Hours</h3>
                            </div>
                        </div>
                        <p class="text-gray-600 text-justify">
                            Contracts are issued directly to <span className="select-all">Evola Deliveries</span>.
                            If you have any feedback please let us know!
                        </p>
                        <p>
                            <span className="font-bold">Notice:</span> Despite the initial low volume, we will attempt to keep all couriers under 48 hours.
                        </p>
                    </div>
                    <hr />
                    <h2 className="w-full font-bold text-xl">Contract Creator</h2>
                    <h3 className="w-full font-bold text-gl">Select the Pickup and Dropoff stations</h3>
                    <div className="flex justify-between">
                        <label htmlFor="outbound">Pickup:</label>
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
                    <div className='flex justify-between my-2 border-b-2 border-dashed border-green-700'>
                        <div className="flex justify-start">
                            <label>Station (from):</label>
                        </div>
                        <div className="flex justify-end">
                            <span className="select-all cursor-pointer mx-2" onClick={() => outboundRoute && UtilsService.clipboardCopy(outboundRoute.station)}>{outboundRoute && outboundRoute.station}</span>
                            <FontAwesomeIcon className="cursor-pointer" icon={faCopy} onClick={() => outboundRoute && UtilsService.clipboardCopy(outboundRoute.station)} />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <label htmlFor="inbound">Dropoff:</label>
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
                    <div className='flex justify-between my-2 border-b-2 border-dashed border-green-700'>
                        <div className="flex justify-start">
                            <label>Station (from):</label>
                        </div>
                        <div className="flex justify-end">
                            <span className="select-all cursor-pointer mx-2" onClick={() => inboundRoute && UtilsService.clipboardCopy(inboundRoute.station)}>{inboundRoute && inboundRoute.station}</span>
                            <FontAwesomeIcon className="cursor-pointer" icon={faCopy} onClick={() => inboundRoute && UtilsService.clipboardCopy(inboundRoute.station)} />
                        </div>
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
