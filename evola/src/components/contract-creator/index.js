import React, { useEffect, useState, useMemo } from 'react';
import PackageDetails from '../package-details';
import OrderTicket from '../order-ticket';
import DataService from '../../services/data-service';
import ConfigService from '../../services/config-service';
import ContractService from "../../services/esi-service";
import UtilsService from "../../services/utils-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from '@fortawesome/free-regular-svg-icons';

function calculatePricing(inboundRouteDeep, price, volume, janice, rushFee = 0, applyRushFee = false) {
    const volumeIsk = inboundRouteDeep ? Math.ceil(volume * inboundRouteDeep.reward.volume) : 0;
    const collateralIsk = inboundRouteDeep ? Math.ceil((price / 100) * inboundRouteDeep.reward.collateral) : 0;
    const volumeInvalid = inboundRouteDeep ? inboundRouteDeep.limits.volume < volume : false;
    const collateralInvalid = inboundRouteDeep ? inboundRouteDeep.limits.collateral < price : false;
    let total = volumeIsk + collateralIsk;

    if (inboundRouteDeep && total < inboundRouteDeep.minimumReward) {
        total = inboundRouteDeep.minimumReward;
    }

    if (applyRushFee) {
        total += rushFee;
    }

    return {
        price: price,
        volume: volume,
        janice: janice,
        totals: {
            volumeInvalid: volumeInvalid,
            collateralInvalid: collateralInvalid,
            volume: volumeIsk,
            collateral: collateralIsk,
            rush: applyRushFee ? rushFee : 0,
            total: total
        }
    };
}

export default function ContractCreator() {
    const [pricing, setPricing] = useState(calculatePricing(null, 0, 0, ""));
    const [outboundValue, setOutboundValue] = useState(DataService.default.region + "|" + DataService.default.system);
    const [inboundValue, setInboundValue] = useState("");
    const [inboundRoute, setInboundRoute] = useState();
    const [outboundRoute, setOutboundRoute] = useState();
    const [rushOrderCheck, setRushOrderCheck] = useState(false);
    const [outstandingContracts, setOutstandingContracts] = useState();
    const [progressContracts, setProgressContracts] = useState();
    const [HundredContracts, setLast100ContractTime] = useState();
    const [MJJitaHundredContracts, setLast100MJJitaContracts] = useState();

    const rushAllowed = inboundRoute?.allowRush === true;

    const rushFee = useMemo(() => {
        return inboundRoute?.overrideRushFeeAmount ?? DataService.default.fees.rushFeeAmount;
    }, [inboundRoute]);

    const displayRushFee = rushFee;

    useEffect(() => {
        setOutboundRoute(DataService.getOutboundRoute(outboundValue));
    }, [outboundValue]);

    useEffect(() => {
        setInboundRoute(DataService.getInboundRoute(outboundValue, inboundValue));
    }, [inboundValue, outboundValue]);

    useEffect(() => {
        setPricing(calculatePricing(inboundRoute, pricing.price, pricing.volume, pricing.janice, rushFee, rushOrderCheck && rushAllowed));
    }, [inboundRoute]);

    useEffect(() => {
        setRushOrderCheck(false);
        setPricing(calculatePricing(inboundRoute, pricing.price, pricing.volume, pricing.janice, rushFee, false));
    }, [outboundRoute]);

    useEffect(() => {
        if (!rushAllowed && rushOrderCheck) {
            setRushOrderCheck(false);
        }
        setPricing(calculatePricing(inboundRoute, pricing.price, pricing.volume, pricing.janice, rushFee, rushOrderCheck && rushAllowed));
    }, [inboundRoute, outboundRoute]);

    useEffect(() => {
        setPricing(calculatePricing(inboundRoute, pricing.price, pricing.volume, pricing.janice, rushFee, rushOrderCheck && rushAllowed));
    }, [rushOrderCheck]);

    const handleOutboundChanged = (event) => setOutboundValue(event.target.value);
    const handleInboundChanged = (event) => setInboundValue(event.target.value);

    const handlePricingChange = (price, volume, janice) => {
        setPricing(calculatePricing(inboundRoute, price, volume, janice, rushFee, rushOrderCheck && rushAllowed));
    };

    useEffect(() => {
        ContractService.getContracts().then(r => {
            setOutstandingContracts(r.Outstanding);
            setProgressContracts(r.InProgress);
            setLast100ContractTime(r.HundredContracts);
            setLast100MJJitaContracts(r.MJJitaHundredContracts);
        }).catch(console.log);
    }, []);


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
                    {(() => {
                        return (
                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="form-check-input appearance-none border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                        checked={rushOrderCheck}
                                        onChange={(e) => setRushOrderCheck(e.target.checked)}
                                        disabled={!rushAllowed}
                                        id="rushOrderTop"
                                    />
                                    <span className={`text-gray-800 font-medium ${!rushAllowed ? 'opacity-50' : ''}`}>
                                        Request Rush Delivery
                                    </span>
                                </label>
                                <div className={`text-sm pl-7 leading-snug -mt-1 ${!rushAllowed ? 'text-gray-400' : 'text-gray-600'}`}>
                                    +<span className='font-bold'>{displayRushFee.toLocaleString()}</span> ISK flat fee <span className="font-semibold">*Guaranteed Priority*</span><br />
                                    <span className="italic">Guaranteed 24-hour delivery or top of queue.</span> Must be clearly marked as <span className="text-blue-600 font-semibold">priority</span>.<br />
                                </div>
                            </div>
                        );
                    })()}
                    <PackageDetails system={inboundRoute} onPricingChange={handlePricingChange} />
                </div>
            </div>
            <div className="my-1 px-1 w-full overflow-hidden sm:my-1 sm:px-1 sm:w-1/2 md:my-1 md:px-1 md:w-1/2 lg:my-1 lg:px-1 lg:w-1/2 xl:my-1 xl:px-1 xl:w-1/2">
                <div className="flex justify-center w-full">
                    <OrderTicket outbound={outboundRoute} inbound={inboundRoute} pricing={pricing} rushFee={rushFee} />
                </div>
            </div>
        </div>
    );
};
