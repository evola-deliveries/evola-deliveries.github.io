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
            if (val >= 0) {
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
            if (val >= 0) {
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
        <div className="mt-6">
            <h3 className="text-blue-400 font-bold text-lg leading-tight tracking-wide uppercase mb-1">Package Details</h3>
            <p className="text-sm text-gray-400 mb-3">Select both pickup and dropoff routes to enable input area below.</p>

            <div>
                {overridePriceCheck ? (
                    <div className="flex-wrap bg-gray-800 border-l-4 border-blue-600 rounded-md w-full px-6 py-4">
                        <div className="flex justify-between items-center mb-3 text-sm text-gray-300">
                            <label className="mr-2" htmlFor="input-Isk">Total Sell Price (ISK)</label>
                            <input
                                id="input-Isk"
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="0"
                                value={overridePrice}
                                onChange={handleOverridePrice}
                                className="bg-gray-900 text-white border border-gray-700 rounded px-2 py-1 w-1/2"
                            />
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-300">
                            <label className="mr-2" htmlFor="input-volume">Total Volume (m³)</label>
                            <input
                                id="input-volume"
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="0"
                                value={overrideVolume}
                                onChange={handleOverrideVolume}
                                className="bg-gray-900 text-white border border-gray-700 rounded px-2 py-1 w-1/2"
                            />
                        </div>
                    </div>
                ) : (
                    <textarea
                        className="w-full rounded bg-gray-800 text-gray-200 border border-gray-700 px-4 py-2 disabled:opacity-50"
                        disabled={isDisabled()}
                        onChange={handleContentChange}
                        placeholder="Tritanium 1000 ..."
                    />
                )}
            </div>

            <div className="flex items-center mt-4">
                <button
                    className="bg-blue-600 disabled:bg-gray-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-500 transition duration-200"
                    disabled={isDisabled()}
                    onClick={getJanicePrices}
                >
                    Calculate Prices
                </button>
                <div className="pl-6">
                    <label className="flex items-center text-sm text-gray-300 cursor-pointer">
                        <input
                            type="checkbox"
                            className="form-check-input appearance-none border border-gray-600 rounded-sm bg-gray-800 checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mr-2"
                            checked={overridePriceCheck}
                            onChange={handleOverridePriceCheck}
                            disabled={isDisabled()}
                            id="overridePrice"
                        />
                        Override Price
                    </label>
                </div>
            </div>

            {/* Error */}
            {errorMessage && (
                <div className="bg-red-900 border-l-4 border-red-600 my-3 rounded-md w-full px-6 py-4 text-red-300 text-sm">
                    {errorMessage}
                    <br />
                    You can override the price instead.
                </div>
            )}

            {/* Success */}
            {success && (
                <div className="bg-green-900 border-l-4 border-green-600 my-3 rounded-md w-full px-6 py-4 text-green-300 text-sm">
                    <span className="font-semibold text-white">Success!</span> See results on the <span className="font-bold text-blue-400">Order Ticket</span> once you're ready.
                    <br />
                    <span className="italic">Select and copy/paste</span> the <span className="font-bold text-yellow-300">Station names, Total Reward, Total Collateral, and Janice reference</span> into your in-game contract.
                </div>
            )}
        </div>

    )
}
