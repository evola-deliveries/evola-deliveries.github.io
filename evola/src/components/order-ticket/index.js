import React, { Component } from 'react';
//https://play.tailwindcss.com/YStq9HbozS?file=css or https://play.tailwindcss.com/FkK6NzeRPr
class OrderTicket extends Component {
    render() {
        return (
            <div>
                <div class="flex m-80">
                    <div class="p-1 border-2 border-black font-sans w-72">
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
                                <span><a href="#" class="text-purple-900 font-semibold">Janice 55PO1f</a></span>
                            </div>
                            <hr class="border-gray-500" />
                            <div class="flex justify-between">
                                <span class="italic">Cubic Meter's</span>
                                <div class="font-bold">80,000,00 m3</div>
                            </div>
                            <hr class="border-gray-500" />
                            <div class="flex justify-between">
                                <span class="italic">Jita Sell Value</span>
                                <div class="font-bold">4.526.789.200.00 isk</div>
                            </div>
                            <hr class="border-gray-500" />
                            <div class="flex justify-between">
                                <div class="font-bold">R1O</div>
                                <div>to</div>
                                <div class="font-bold">Jita</div>
                            </div>
                            <div class="flex justify-between">
                                <div class="pl-4">Volume</div>
                                <div>875 isk</div>
                            </div>
                            <div class="flex justify-between">
                                <div class="pl-4">Collateral</div>
                                <div>1%</div>
                            </div>
                            <hr class="border-gray-500" />
                            <div class="flex justify-between">
                                <div>
                                    <span class="font-bold">Totals</span>
                                </div>
                                <div class="font-bold">115,267,892.00 isk</div>
                            </div>
                            <hr class="border-gray-500" />
                            <div class="flex justify-between">
                                <div class="pl-4">Volume</div>
                                <div>70.000.000.00 isk</div>
                            </div>
                            <hr class="border-gray-500" />
                            <div class="flex justify-between">
                                <div class="pl-4">Collateral</div>
                                <div>45.267.892.00 isk</div>
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

            </div>
        );
    }
}

export default OrderTicket;
