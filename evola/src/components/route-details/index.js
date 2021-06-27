import React from 'react';
import DataService from '../../services/data-service';
/*
"reward": {"volume": 1175.00, "collateral": 1.00 }, 
"limits": { "volume": 130000.00, "collateral": 3500000000 }, 
"minimumReward": 50000000
*/
export default function RouteDetails({outbound, inbound}) {
    const system = DataService.getInboundRoute(outbound, inbound);
    return (
        <fieldset>
            <legend>Route Details</legend>
            <div>
                <span>Reward</span>
                <div class="flex justify-between">
                    <span>Volume</span>
                    <div><span class="font-bold">{system && Number(system.reward.volume).toLocaleString('en') + ' isk'}</span></div>
                </div>
                <div class="flex justify-between">
                    <span>Collateral</span>
                    <div><span class="font-bold">{system && Number(system.reward.collateral).toLocaleString('en') + ' %'}</span></div>
                </div>
            </div>
            <div>
                <span>Limits</span>
                <div class="flex justify-between">
                    <span>Volume</span>
                    <div><span class="font-bold">{system && Number(system.limits.volume).toLocaleString('en') + ' m3'}</span></div>
                </div>
                <div class="flex justify-between">
                    <span>Collateral</span>
                    <div><span class="font-bold">{system && Number(system.limits.collateral).toLocaleString('en') + ' isk'}</span></div>
                </div>
                <div class="flex justify-between">
                    <span>Reward</span>
                    <div><span class="font-bold">{system && Number(system.minimumReward).toLocaleString('en') + ' isk'}</span></div>
                </div>
            </div>
        </fieldset>
    )
}