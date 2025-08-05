import React, { useEffect, useState, useMemo } from 'react';
import PackageDetails from '../package-details';
import OrderTicket from '../order-ticket';
import DataService from '../../services/data-service';
import ConfigService from '../../services/config-service';
import ContractService from "../../services/esi-service";
import UtilsService from "../../services/utils-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from '@fortawesome/free-regular-svg-icons';

import EvolaLoyaltyCard from '../loyalty-card';

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
        setPricing(calculatePricing(
            inboundRoute,
            pricing.price,
            pricing.volume,
            pricing.janice,
            rushFee,
            rushOrderCheck && rushAllowed
        ));
    }, [
        inboundRoute,
        pricing.price,
        pricing.volume,
        pricing.janice,
        rushFee,
        rushOrderCheck,
        rushAllowed
    ]);

    useEffect(() => {
        const rushStillAllowed = inboundRoute?.allowRush === true;
        const shouldApplyRush = rushOrderCheck && rushStillAllowed;

        if (!rushStillAllowed && rushOrderCheck) {
            setRushOrderCheck(false);
        }

        setPricing(calculatePricing(
            inboundRoute,
            pricing.price,
            pricing.volume,
            pricing.janice,
            rushFee,
            shouldApplyRush
        ));
    }, [
        outboundRoute,
        inboundRoute,
        pricing.price,
        pricing.volume,
        pricing.janice,
        rushFee,
        rushOrderCheck
    ]);

    const handleOutboundChanged = (event) => setOutboundValue(event.target.value);
    const handleInboundChanged = (event) => setInboundValue(event.target.value);

    const handlePricingChange = (price, volume, janice) => {
        setPricing(calculatePricing(
            inboundRoute,
            price,
            volume,
            janice,
            rushFee,
            rushOrderCheck && rushAllowed
        ));
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
                <div className="shadow-lg rounded-lg bg-gray-900 border border-gray-700 px-4 py-3">
                    <div className="my-2 text-gray-300 text-sm">
                        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-700">
                            <div className="headerCont text-center md:text-left">
                                <h4 className="uppercase tracking-widest text-sm text-gray-400 mb-1 md:block">Welcome to</h4>
                                <h3 className="font-extrabold text-3xl md:text-4xl text-blue-400 md:block">EVOLA DELIVERIES</h3>

                                <a
                                    className="inline-flex items-center mt-4 text-lg text-blue-500 hover:text-blue-300 focus:text-blue-300 transition-colors duration-200"
                                    href={ConfigService.discord_url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span className="uppercase font-medium tracking-wide">Join Discord</span>
                                    <span className="text-xl ml-2 animate-pulse">&#x279c;</span>
                                </a>
                            </div>
                        </div>
                        <div className="max-w-5xl mx-auto p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                                {/* Box 1: Task Overview */}
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center shadow-lg">
                                    <h2 className="text-sm uppercase text-gray-400 tracking-widest mb-2">Task Status</h2>
                                    <p className="text-3xl font-extrabold text-green-400">{outstandingContracts}</p>
                                    <p className="text-xs text-gray-500 mt-1">Outstanding</p>
                                    <p className="text-2xl font-bold text-yellow-400 mt-4">{progressContracts}</p>
                                    <p className="text-xs text-gray-500">In Progress</p>
                                </div>

                                {/* Box 2: Contract Time */}
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center shadow-lg">
                                    <h2 className="text-sm uppercase text-gray-400 tracking-widest mb-2">Avg Contract Time</h2>
                                    <p className="text-4xl font-extrabold text-blue-400">{HundredContracts}h</p>
                                    <p className="text-xs text-gray-500 mt-1">Hours per Contract</p>
                                </div>

                                {/* Box 3: MJ to Jita */}
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center shadow-lg">
                                    <h2 className="text-sm uppercase text-gray-400 tracking-widest mb-2">E8 ↔ Jita Travel</h2>
                                    <p className="text-4xl font-extrabold text-purple-400">{MJJitaHundredContracts}h</p>
                                    <p className="text-xs text-gray-500 mt-1">Journey Duration</p>
                                </div>

                            </div>
                        </div>

                    </div>
                    <h2 className="w-full text-xl text-blue-400 font-bold uppercase tracking-wider mb-1">Contract Creator</h2>
                    <h3 className="w-full text-gray-400 font-medium text-sm mb-4">Select the Pickup and Dropoff stations</h3>
                    <div className="flex justify-between items-center text-sm text-gray-300 mb-2">
                        <label htmlFor="outbound" className="mr-2">Pickup:</label>
                        <select
                            name="outbound"
                            defaultValue={outboundValue}
                            onChange={handleOutboundChanged}
                            className="bg-gray-800 border border-gray-600 text-gray-200 px-3 py-1 rounded w-2/3"
                        >
                            <option disabled hidden value=''></option>
                            {DataService.routes.map(route => (
                                <optgroup key={route.region} label={route.region}>
                                    {route.systems.map(system => (
                                        <option key={`${route.region}-${system.system}`} value={route.region + "|" + system.system}>
                                            {system.system}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-between items-center my-2 border-b border-dashed border-blue-700 pb-1 text-sm text-gray-400">
                        <div>Station (from):</div>
                        <div className="flex items-center space-x-2">
                            <span className="cursor-pointer hover:text-white" onClick={() => outboundRoute && UtilsService.clipboardCopy(outboundRoute.station)}>
                                {outboundRoute && outboundRoute.station}
                            </span>
                            <FontAwesomeIcon className="cursor-pointer text-blue-500 hover:text-blue-300" icon={faCopy} onClick={() => outboundRoute && UtilsService.clipboardCopy(outboundRoute.station)} />
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-300 mb-2">
                        <label htmlFor="inbound" className="mr-2">Dropoff:</label>
                        <select
                            name="inbound"
                            defaultValue=""
                            onChange={handleInboundChanged}
                            className="bg-gray-800 border border-gray-600 text-gray-200 px-3 py-1 rounded w-2/3"
                        >
                            <option value="">None</option>
                            {DataService.getRoutes(outboundValue).map(route => (
                                <optgroup key={route.region} label={route.region}>
                                    {route.systems.map(system => (
                                        <option key={`${route.region}-${system.system}`} value={route.region + "|" + system.system}>
                                            {system.system}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-between items-center my-2 border-b border-dashed border-purple-700 pb-1 text-sm text-gray-400">
                        <div>Station (to):</div>
                        <div className="flex items-center space-x-2">
                            <span className="cursor-pointer hover:text-white" onClick={() => inboundRoute && UtilsService.clipboardCopy(inboundRoute.station)}>
                                {inboundRoute && inboundRoute.station}
                            </span>
                            <FontAwesomeIcon className="cursor-pointer text-purple-500 hover:text-purple-300" icon={faCopy} onClick={() => inboundRoute && UtilsService.clipboardCopy(inboundRoute.station)} />
                        </div>
                    </div>

                    <div className="mb-4 mt-3">
                        <label className="flex items-center text-sm text-gray-300">
                            <input
                                type="checkbox"
                                className="form-check-input appearance-none border border-gray-500 rounded-sm bg-gray-800 checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mr-2 cursor-pointer"
                                checked={rushOrderCheck}
                                onChange={(e) => setRushOrderCheck(e.target.checked)}
                                disabled={!rushAllowed}
                                id="rushOrderTop"
                            />
                            <span className={`font-semibold ${!rushAllowed ? 'opacity-50 text-gray-500' : 'text-blue-400'}`}>
                                Request Rush Delivery
                            </span>
                        </label>
                        <div className={`text-xs mt-1 ml-6 leading-snug ${!rushAllowed ? 'text-gray-500' : 'text-gray-400'}`}>
                            +<span className="font-bold text-green-400">{displayRushFee.toLocaleString()}</span> ISK flat fee — <span className="font-semibold text-yellow-300">Guaranteed Priority</span><br />
                            <span className="italic text-gray-500">Delivery within 24h or placed top of queue. Marked as <span className="text-blue-500">priority</span>.</span>
                        </div>
                    </div>

                    <PackageDetails system={inboundRoute} onPricingChange={handlePricingChange} />

                    <div className="bg-gray-800 border-l-4 border-blue-600 rounded-md text-blue-300 px-4 py-3 shadow-md mt-4" role="alert">
                        <div className="flex">
                            <div className="py-1">
                                <svg className="fill-current h-6 w-6 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-white">Informational Notice</p>
                                <p className="text-sm">Contracts are issued to <span className="select-all text-blue-400">Evola Deliveries</span>. Feedback is welcome!</p>
                                <p><span className="font-bold text-yellow-400">Note:</span> Though volumes are high, our goal is delivery within 48 hours.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="my-1 px-1 w-full overflow-hidden sm:w-1/2">
                <div className="flex justify-center w-full p-4">
                    <OrderTicket
                        outbound={outboundRoute}
                        inbound={inboundRoute}
                        pricing={pricing}
                        rushFee={rushOrderCheck && rushAllowed ? rushFee : 0}
                    />
                </div>
                <EvolaLoyaltyCard
                character={{
                    id: 2113637343,
                    name: "Faux Mulder",
                    birthday: "2018-01-01T02:07:31Z",
                    security_status: 0.001
                }}
                rank="SSS"
                corpRank="SS"
                loyaltyPoints={928430}
                />
            </div>
        </div>
    );
};