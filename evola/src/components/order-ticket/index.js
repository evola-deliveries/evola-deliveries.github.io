import React from 'react';
//https://play.tailwindcss.com/YStq9HbozS?file=css or https://play.tailwindcss.com/FkK6NzeRPr
export default function ContractCreator({ outbound, inbound, pricing }) {
    return (
        <div class="py-8">
            <div class="p-1 border-2 border-black font-sans w-80 sm:w-72 bg-white">
                <div class="flex justify-center text-4xl font-extrabold">Evola</div>
                <div class="flex justify-center text-4xl font-extrabold">Deliveries</div>
                <div class="flex justify-center leading-snug">Little beef's Order</div>
                <div class="flex justify-between font-bold border-b-8 border-black">
                    <div>Identifier</div>
                    <div>I13oM</div>
                </div>
                <div class="flex justify-between items-end font-extrabold">
                    <div>
                        <div class="font-bold">Contract's</div>
                        <div class="text-4xl">Packages</div>
                    </div>
                    <div class="text-5xl">1</div>
                </div>
                <div class="border-t-4 border-black text-sm pb-1">
                    <hr class="border-gray-500" />
                    <div class="flex justify-between">
                        <div>
                            <span class="font-bold">Package 1</span>
                        </div>
                        <span>{pricing && pricing.janice !== ""
                            ? <a href={pricing.janice !== "" && "https://janice.e-351.com/a/" + pricing.janice} target="_blank" rel="noreferrer" class="text-purple-900 font-semibold">Janice {pricing && pricing.janice}</a>
                            : ""}</span>
                    </div>
                    <hr class="border-gray-500" />
                    <div class="flex justify-between">
                        <span class="italic pl-4">Appraisal Reference</span>
                        <div><span class="select-all">{pricing.janice !== "" && pricing.janice}</span></div>
                    </div>
                    <hr class="border-gray-500" />
                    <div class="flex justify-between">
                        <span class="italic pl-4">Cubic Meter's</span>
                        <div className={pricing && pricing.totals.volumeInvalid ? "font-bold text-red-600" : "font-bold text-green-600"}><span class="select-all">{pricing && Number(pricing.volume).toLocaleString('en')}</span> m3</div>
                    </div>
                    <hr class="border-gray-500" />
                    <div class="flex justify-between">
                        <span class="italic pl-4">Jita Sell Value</span>
                        <div className={pricing && pricing.totals.collateralInvalid ? "font-bold text-red-600" : "font-bold text-green-600"}><span class="select-all">{pricing && Number(pricing.price).toLocaleString('en')}</span> isk</div>
                    </div>
                    <hr class="border-gray-500" />
                    <div class="flex justify-between">
                        <div class="font-bold">{outbound && outbound.system}</div>
                        <div>to</div>
                        <div class="font-bold">{inbound && inbound.system}</div>
                    </div>
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
                        <div class="font-bold"><span class="select-all">{pricing && Number(pricing.totals.total).toLocaleString('en')}</span> isk</div>
                    </div>
                    <hr class="border-gray-500" />
                    <div class="flex justify-between">
                        <div class="pl-4">Volume</div>
                        <div><span class="select-all">{pricing && Number(pricing.totals.volume).toLocaleString('en')}</span> isk</div>
                    </div>
                    <hr class="border-gray-500" />
                    <div class="flex justify-between">
                        <div class="pl-4">Collateral</div>
                        <div><span class="select-all">{pricing && Number(pricing.totals.collateral).toLocaleString('en')}</span> isk</div>
                    </div>
                </div>
                <div class="border-t-4 border-black pt-1 text-sm"></div>
                <div class="flex justify-center"></div>
                <div class="border-t-8 border-black flex leading-none text-xs pt-2 pb-1">
                    <div class="pr-1">*</div>
                    <div>
                        Contracts are issued directly to <span class="font-bold">Evola Deliveries Corporation</span>. If you wish to use our services for a route that is currently not supported please contact <span class="font-bold">Nahtsu</span> directly.<br />
                        If you have any feedback please let us know!
                    </div>
                </div>
            </div>
        </div>
    );
}
