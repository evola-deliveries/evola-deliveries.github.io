import React, { useState } from 'react';
import Janice from '../../services/janice-service';

export default function PackageDetails({ system, onPricingChange }) {
    const [content, setContent] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [overridePriceCheck, setOveridePriceCheck] = useState(false);
    const [overridePrice, setOveridePrice] = useState();
    const [overrideVolume, setOverideVolume] = useState();

    const handleOverridePriceCheck = () => {
        setOveridePriceCheck(!overridePriceCheck);
        setErrorMessage("");
        setSuccess(false);
    };

    const handleOverridePrice = event => {
        let val = parseFloat(event.target.value, 10);
        if (isNaN(val)) {
            event.preventDefault();
        } else {
            // is A Number
            if(val >= 0 ) {
                setOveridePrice(val)
            } else { 
                event.preventDefault();
            }             
        }
    };

    const handleOverrideVolume = event => {
        let val = parseFloat(event.target.value, 10);
        if (isNaN(val)) {
            event.preventDefault();
        } else {
            // is A Number
            if(val >= 0 ) {
                setOverideVolume(val);
            } else { 
                event.preventDefault();
            }             
        }
    };

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
        if (overridePriceCheck) {
            onPricingChange(overridePrice, overrideVolume, '');
            setErrorMessage("");
            setSuccess(true);
            return;
        }
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
                {overridePriceCheck ? <div className="flex-wrap bg-gray-100 border-l-4 my-2 border-gray-300 rounded-md w-full px-6 py-4 cursor-pointer">
                <div className='flex justify-between content-center'>
                    <label className="mr-2" htmlFor="input-Isk">
                        Total Sell Price
                    </label>
                    <input id="input-Isk" type='number' step="0.1" min='0' placeholder="0" value={overridePrice} onChange={handleOverridePrice} />
                </div>
                <div className='flex justify-between'>
                    <label className="mr-2" htmlFor="input-volume">
                        Total Volume
                    </label>
                    <input id="input-volume" type='number' step="0.1" min='0' placeholder="0" value={overrideVolume} onChange={handleOverrideVolume}/>
                </div>
                </div> : <textarea className="w-full rounded disabled:bg-gray-200" disabled={isDisabled()} onChange={handleContentChange} placeholder="Tritanium 1000 ..."></textarea>}
            </div>
            <div className="flex">
                <button className="bg-green-700 disabled:bg-gray-500 text-white px-6 py-2 rounded font-medium hover:bg-green-600 transition duration-200 each-in-out" disabled={isDisabled()} onClick={getJanicePrices}>Calculate Prices</button>
                <div className='px-6 py-2'>
                    <input className="form-check-input appearance-none border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value={overridePriceCheck} onChange={handleOverridePriceCheck} disabled={isDisabled()} id="overridePrice" />
                    <label className="form-check-label inline-block text-gray-800" for="overridePrice">
                        Override Price
                    </label>
                </div>
            </div>
            {errorMessage ? <div className="bg-red-100 border-l-4 border-red-300 my-2 rounded-md w-full px-6 py-4 cursor-pointer">{errorMessage}<br/>You can Override the price instead.</div> : ""}
            {success ? <div className="bg-green-100 border-l-4 border-green-300 my-2 rounded-md w-full px-6 py-4 cursor-pointer">Success! See results on the <span className="font-bold">Order Ticket</span> once you are ready <span className="italic">select and copy/paste</span> the <span className="font-bold">Station's names, Total Reward, Total Collateral and Janice reference</span> into your contract in-game.</div> : ""}
        </div>
    )
}
