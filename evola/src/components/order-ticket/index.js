import React from 'react';
import Config from '../../services/config-service';

export default function ContractCreator({ outbound, inbound, pricing }) {
    return (
        <div className="py-8">
            <div className="p-1 border-2 border-black font-sans w-80 sm:w-72 bg-white">
                <div className="flex justify-center text-4xl font-extrabold">Evola</div>
                <div className="flex justify-center text-4xl font-extrabold">Deliveries</div>
                <div className="flex justify-center leading-snug border-b-4 border-black">Eve Online Corporation</div>
                <div className="text-sm pb-1">
                    <hr className="border-gray-500" />
                    <div className="flex justify-between">
                        <div>
                            <span className="font-bold">Package Details</span>
                        </div>
                        <span>{pricing && pricing.janice !== ""
                            ? <a href={pricing.janice !== "" && Config.janice_url + pricing.janice} target="_blank" rel="noreferrer" className="text-purple-900 font-semibold">Janice {pricing && pricing.janice}</a>
                            : ""}</span>
                    </div>
                    <hr className="border-gray-500" />
                    <div className="flex justify-between">
                        <span className="italic pl-4">Appraisal Reference</span>
                        <div><span className="select-all">{pricing.janice !== "" && pricing.janice}</span></div>
                    </div>

                    <div className="flex justify-between">
                        <span className="italic pl-4">Cubic Meter's</span>
                        <div className={pricing && pricing.totals.volumeInvalid ? "font-bold text-red-600" : "font-bold text-green-600"}><span className="select-all">{pricing && Number(pricing.volume).toLocaleString('en')}</span> m3</div>
                    </div>


<div className="flex justify-between">
                        <div className="font-bold">Pricing</div>
            
                    </div>
                    <hr className="border-gray-500" />
<div className="flex justify-between">
                        <div className="pl-4">Volume</div>
                        <div className={pricing && pricing.totals.volumeInvalid ? "font-bold text-red" : ""}><span className="select-all">{inbound && Number(inbound.reward.volume).toLocaleString('en')}</span> m3</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="pl-4">Collateral</div>
                        <div>{inbound && Number(inbound.reward.collateral).toLocaleString('en')}%</div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <span className="font-bold">Limits</span>
                        </div>
                    </div>
                    <hr className="border-gray-500" />
                    <div className="flex justify-between">
                        <div className="pl-4">Min Reward</div>
                        <div><span className="select-all">{inbound && Number(inbound.minimumReward).toLocaleString('en')}</span> isk</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="pl-4">Max Volume</div>
                        <div><span className="select-all">{inbound && Number(inbound.limits.volume).toLocaleString('en')}</span> m3</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="pl-4">Max Collateral</div>
                        <div><span className="select-all">{inbound && Number(inbound.limits.collateral).toLocaleString('en')}</span> isk</div>
                    </div>
                    <hr className="border-gray-500" />
                    <div className="flex justify-between">
                        <div>
                            <span className="font-bold">Total Reward</span>
                        </div>
                        <div className="font-bold text-green-600"><span className="select-all">{pricing && Number(pricing.totals.total).toLocaleString('en')}</span> isk</div>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <span className="font-bold">Total Collateral</span>
                        </div>
                        <div className={pricing && pricing.totals.collateralInvalid ? "font-bold text-red-600" : "font-bold text-green-600"}><span className="select-all">{pricing && Number(pricing.price).toLocaleString('en')}</span> isk</div>
                    </div>


                </div>

                <div className="flex justify-center"></div>
                <div className="border-t-4 border-black flex leading-none text-xs pt-2 pb-1">
                    <div className="pr-1">*</div>
                    <div>
                        Contracts are issued directly to: <br/>
                        <span className="font-bold">Evola Deliveries</span><br/><br/>
                        <span className="font-bold">No Containers!</span><br />
                        <span className="font-bold">No Assembled Ships!</span><br/>
                        <span className="font-bold">Expiration: 7 Days</span><br/>
                        <span className="font-bold">Days to Complete: 7 Days</span><br/><br/>
                        If you have any feedback please contact <span className="font-bold">Nahtsu</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
