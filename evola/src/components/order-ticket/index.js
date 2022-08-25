import React from 'react';
import Config from '../../services/config-service';

export default function ContractCreator({ outbound, inbound, pricing }) {
    return (
        <div class="py-8">
            <div class="p-1 border-2 border-black font-sans w-80 sm:w-72 bg-white">
                <div class="flex justify-center text-4xl font-extrabold">Evola</div>
                <div class="flex justify-center text-4xl font-extrabold">Deliveries</div>
                <div class="flex justify-center leading-snug border-b-4 border-black">Eve Online Corporation</div>
                <div class="text-sm pb-1">
                    <hr class="border-gray-500" />
                    <div class="flex justify-between">
                        <div>
                            <span class="font-bold">Package Details</span>
                        </div>
                        <span>{pricing && pricing.janice !== ""
                            ? <a href={pricing.janice !== "" && Config.janice_url + pricing.janice} target="_blank" rel="noreferrer" class="text-purple-900 font-semibold">Janice {pricing && pricing.janice}</a>
                            : ""}</span>
                    </div>
                    <hr class="border-gray-500" />
                    <div class="flex justify-between">
                        <span class="italic pl-4">Appraisal Reference</span>
                        <div><span class="select-all">{pricing.janice !== "" && pricing.janice}</span></div>
                    </div>

                    <div class="flex justify-between">
                        <span class="italic pl-4">Cubic Meter's</span>
                        <div className={pricing && pricing.totals.volumeInvalid ? "font-bold text-red-600" : "font-bold text-green-600"}><span class="select-all">{pricing && Number(pricing.volume).toLocaleString('en')}</span> m3</div>
                    </div>


<div class="flex justify-between">
                        <div class="font-bold">Pricing</div>
            
                    </div>
                    <hr class="border-gray-500" />
<div class="flex justify-between">
                        <div class="pl-4">Volume</div>
                        <div className={pricing && pricing.totals.volumeInvalid ? "font-bold text-red" : ""}><span class="select-all">{inbound && Number(inbound.reward.volume).toLocaleString('en')}</span> m3</div>
                    </div>
                    <div class="flex justify-between">
                        <div class="pl-4">Collateral</div>
                        <div>{inbound && Number(inbound.reward.collateral).toLocaleString('en')}%</div>
                    </div>
                    <div class="flex justify-between">
                        <div>
                            <span class="font-bold">Limits</span>
                        </div>
                    </div>
                    <hr class="border-gray-500" />
                    <div class="flex justify-between">
                        <div class="pl-4">Min Reward</div>
                        <div><span class="select-all">{inbound && Number(inbound.minimumReward).toLocaleString('en')}</span> isk</div>
                    </div>
                    <div class="flex justify-between">
                        <div class="pl-4">Max Volume</div>
                        <div><span class="select-all">{inbound && Number(inbound.limits.volume).toLocaleString('en')}</span> m3</div>
                    </div>
                    <div class="flex justify-between">
                        <div class="pl-4">Max Collateral</div>
                        <div><span class="select-all">{inbound && Number(inbound.limits.collateral).toLocaleString('en')}</span> isk</div>
                    </div>
                    <hr class="border-gray-500" />
                    <div class="flex justify-between">
                        <div>
                            <span class="font-bold">Total Reward</span>
                        </div>
                        <div class="font-bold text-green-600"><span class="select-all">{pricing && Number(pricing.totals.total).toLocaleString('en')}</span> isk</div>
                    </div>

                    <div class="flex justify-between">
                        <div>
                            <span class="font-bold">Total Collateral</span>
                        </div>
                        <div className={pricing && pricing.totals.collateralInvalid ? "font-bold text-red-600" : "font-bold text-green-600"}><span class="select-all">{pricing && Number(pricing.price).toLocaleString('en')}</span> isk</div>
                    </div>


                </div>

                <div class="flex justify-center"></div>
                <div class="border-t-4 border-black flex leading-none text-xs pt-2 pb-1">
                    <div class="pr-1">*</div>
                    <div>
                        Contracts are issued directly to: <br/>
                        <span class="font-bold">Evola Deliveries</span>.<br/><br/>
                        <span class="font-bold">No Containers!</span><br />
                        <span class="font-bold">No Assembled Ships!</span><br/><br/>
                        If you have any feedback please contact <span class="font-bold">Nahtsu#9654</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
