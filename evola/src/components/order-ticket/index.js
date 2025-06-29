import React from 'react';
import Config from '../../services/config-service';
import UtilsService from '../../services/utils-service';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from '@fortawesome/free-regular-svg-icons';

export default function ContractCreator({ outbound, inbound, pricing, rushFee }) {
    return (
        <div className="py-8">
            <div className="p-4 border border-gray-700 font-mono w-full max-w-md bg-gray-900 rounded-lg shadow-lg text-gray-300 mx-auto">

                {/* Header */}
                <div className="text-center">
                    <div className="text-2xl font-extrabold text-blue-400 tracking-wide">EVOLA</div>
                    <div className="text-2xl font-extrabold text-blue-400 tracking-wide mb-1">DELIVERIES</div>
                    <div className="text-xs uppercase text-gray-500 border-b border-gray-700 pb-1 mb-2">Eve Online Corporation</div>
                </div>

                {/* Janice & Appraisal */}
                <div className="text-xs">
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-400">Package Details</span>
                        {pricing?.janice && (
                            <a
                                href={Config.janice_url + pricing.janice}
                                target="_blank"
                                rel="noreferrer"
                                className="text-purple-400 hover:underline"
                            >
                                Janice {pricing.janice}
                            </a>
                        )}
                    </div>
                    <hr className="border-gray-700 mb-2" />

                    <div className="flex justify-between items-center mb-1">
                        <span
                            className="italic cursor-pointer pl-1 hover:text-white"
                            onClick={() => UtilsService.clipboardCopy(pricing?.janice || "")}
                        >
                            Appraisal Ref <FontAwesomeIcon icon={faCopy} className="ml-1" />
                        </span>
                        <span className="select-all">{pricing?.janice}</span>
                    </div>

                    <div className="flex justify-between items-center mb-1">
                        <span className="pl-1 italic">Cubic Meters</span>
                        <span
                            className={`font-bold ${pricing?.totals.volumeInvalid ? "text-red-500" : "text-green-400"
                                }`}
                        >
                            {pricing && Number(pricing.volume).toLocaleString("en")} m³
                        </span>
                    </div>

                    {/* Pricing */}
                    <div className="mt-2 mb-1 font-semibold text-gray-400">Pricing</div>
                    <hr className="border-gray-700 mb-1" />

                    <div className="flex justify-between text-sm mb-1">
                        <span className="pl-1">Volume</span>
                        <span className={pricing?.totals.volumeInvalid ? "text-red-500 font-bold" : ""}>
                            {inbound && Number(inbound.reward.volume).toLocaleString("en")} m³
                        </span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="pl-1">Collateral</span>
                        <span>{inbound && Number(inbound.reward.collateral).toLocaleString("en")}%</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="pl-1">Rush Delivery</span>
                        <span>{inbound && Number(rushFee).toLocaleString("en")} ISK</span>
                    </div>

                    {/* Limits */}
                    <div className="mt-2 mb-1 font-semibold text-gray-400">Limits</div>
                    <hr className="border-gray-700 mb-1" />
                    <div className="flex justify-between text-sm mb-1">
                        <span className="pl-1">Min Reward</span>
                        <span className="select-all">{inbound && Number(inbound.minimumReward).toLocaleString("en")} ISK</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="pl-1">Max Volume</span>
                        <span className="select-all">{inbound && Number(inbound.limits.volume).toLocaleString("en")} m³</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="pl-1">Max Collateral</span>
                        <span className="select-all">{inbound && Number(inbound.limits.collateral).toLocaleString("en")} ISK</span>
                    </div>

                    {/* Totals */}
                    <hr className="border-gray-700 mb-1" />
                    <div className="flex justify-between items-center mb-1">
                        <span
                            className="font-semibold cursor-pointer hover:text-white"
                            onClick={() => UtilsService.clipboardCopy(pricing && Number(pricing.totals.total).toLocaleString("en"))}
                        >
                            Total Reward <FontAwesomeIcon icon={faCopy} className="ml-1" />
                        </span>
                        <span className="font-bold text-green-400 select-all">
                            {pricing && Number(pricing.totals.total).toLocaleString("en")} ISK
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span
                            className="font-semibold cursor-pointer hover:text-white"
                            onClick={() => UtilsService.clipboardCopy(pricing && Number(pricing.price).toLocaleString("en"))}
                        >
                            Total Collateral <FontAwesomeIcon icon={faCopy} className="ml-1" />
                        </span>
                        <span
                            className={`font-bold select-all ${pricing?.totals.collateralInvalid ? "text-red-500" : "text-green-400"
                                }`}
                        >
                            {pricing && Number(pricing.price).toLocaleString("en")} ISK
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-700 mt-4 pt-2 text-xs text-gray-500 leading-snug">
                    <p>
                        Contracts issued to:{" "}
                        <span
                            className="text-white font-bold cursor-pointer select-all"
                            onClick={() => UtilsService.clipboardCopy("Evola Deliveries")}
                        >
                            Evola Deliveries
                        </span>{" "}
                        <FontAwesomeIcon icon={faCopy} className="cursor-pointer ml-1" />
                    </p>
                    <p className="mt-2 text-red-400 font-semibold">No Containers!</p>
                    <p className="text-red-400 font-semibold">No Assembled Ships!</p>
                    <p className="text-yellow-400 font-semibold">Expiration: 7 Days</p>
                    <p className="text-yellow-400 font-semibold">Days to Complete: 7</p>
                    <p className="mt-2">Feedback? Contact <span className="text-blue-400 font-semibold">Nahtsu</span></p>
                </div>
            </div>
        </div>

    );
}
