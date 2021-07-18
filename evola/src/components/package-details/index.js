import React, { useState } from 'react';
import Janice from '../../services/janice-service';

export default function PackageDetails({ system, onPricingChange }) {
    const [content, setContent] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleContentChange = (event) => setContent(event.target.value);
    const HandledAppraisal = (result) => {
        if (result.items.length === 0) {
            setErrorMessage("No Prices Found for items.");
            setSuccess(false);
            return;
        }

        onPricingChange(result.effectivePrices.totalSellPrice, Janice.getTotalVolume(result), result.code);

        setErrorMessage("");
        setSuccess(true);
    };

    const getJanicePrices = (event) => {
        if (content !== '' || content === undefined) {
            Janice.getAppraisal(content)
                .then(HandledAppraisal)
                .catch((reason) => setErrorMessage(reason.message));
        } else {
            setSuccess(false);
            setErrorMessage("Please enter at least one item to the package.")
        }
    };

    const isDisabled = () => system === undefined;

    return (
        <div>
            <h3 className="w-full font-bold text-lg leading-tight">Package Details</h3>
            <p>Select a outbound route and a inbound route to enable the text area below.</p>
            <div>
                <textarea className="w-full rounded disabled:bg-gray-200" disabled={isDisabled()} onChange={handleContentChange} placeholder="Tritium 1000 ..."></textarea>
            </div>
            <div>
                <button className="bg-green-700 disabled:bg-gray-500 text-white px-6 py-2 rounded font-medium hover:bg-green-600 transition duration-200 each-in-out" disabled={isDisabled()} onClick={getJanicePrices}>Calculate Prices</button>
            </div>
            {errorMessage ? <div class="bg-red-100 border-l-4 border-red-300 rounded-md w-full px-6 py-4 cursor-pointer">{errorMessage}</div> : ""}
            {success ? <div class="bg-green-100 border-l-4 border-green-300 rounded-md w-full px-6 py-4 cursor-pointer">Success! See results on the <span className="font-bold">Order Ticket</span> once you are ready <span className="italic">select and copy/paste</span> the <span className="font-bold">Station's names, Total Reward, Total Collateral and Janice reference</span> into your contract in-game.</div> : ""}
        </div>
    )
}