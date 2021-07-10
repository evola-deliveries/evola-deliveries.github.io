import React, { useState } from 'react';
import Janice from '../../services/janice-service';

export default function PackageDetails({ system, onPricingChange }) {
    const [content, setContent] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleContentChange = (event) => setContent(event.target.value);
    const HandledAppraisal = (result) => {
        
        if (result.items.length === 0) {
            setErrorMessage("No Prices Found for items.");
        } else {
            setErrorMessage("");
        }        

        onPricingChange(result.effectivePrices.totalSellPrice, Janice.getTotalVolume(result), result.code);
    };

    const getJanicePrices = (event) => {
        if (content !== '' || content === undefined) {
            Janice.getAppraisal(content)
                .then(HandledAppraisal)
                .catch((reason) => setErrorMessage(reason.message));
        } else {
            setErrorMessage("Please enter at least one item to the package.")
        }
    };

    const isDisabled = () => system === undefined;

    return (
        <div>
            <h3 className="w-full font-bold text-lg leading-tight">Package Details</h3>
            <div>
                <textarea className="w-full" disabled={isDisabled()} onChange={handleContentChange}></textarea>
            </div>
            <div>
                <button className="bg-gray-500 text-white px-6 py-2 rounded font-medium hover:bg-gray-600 transition duration-200 each-in-out" disabled={isDisabled()} onClick={getJanicePrices}>Calculate Prices</button>
            </div>
            {errorMessage ? <p className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">{errorMessage}</p> : ""}
        </div>
    )
}