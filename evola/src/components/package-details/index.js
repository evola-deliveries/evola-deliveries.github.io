import React, { useState } from 'react';
import DataService from '../../services/data-service';
/*
"reward": {"volume": 1175.00, "collateral": 1.00 }, 
"limits": { "volume": 130000.00, "collateral": 3500000000 }, 
"minimumReward": 50000000
*/
export default function PackageDetails({outbound, inbound}) {
    const system = DataService.getInboundRoute(outbound, inbound);
    const [content, setContent] = useState("");
    
    const handleContentChange = (event) => setContent(event.target.value);
    const getJanicePrices = (event) => undefined;

    return (
        <fieldset>
            <legend>Package Details</legend>
            <div>
                <textarea onChange={handleContentChange}>{content}</textarea>
            </div>
            <div>
                <button onClick={getJanicePrices}>Get Prices</button>
            </div>
        </fieldset>
    )
}