import React, { useState } from 'react';
import Janice from '../../services/janice-service';

export default function PackageDetails({ system, onPricingChange }) {
    const [content, setContent] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleContentChange = (event) => setContent(event.target.value);
    const HandledAppraisal = (result) => {
        setErrorMessage(undefined);

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

    return (<div>
        <fieldset>
            <legend>Package Details</legend>
            <div>
                <textarea disabled={isDisabled()} onChange={handleContentChange}></textarea>
            </div>
            <div>
                <button disabled={isDisabled()} onClick={getJanicePrices}>Get Prices</button>
            </div>
        </fieldset>{errorMessage ? <p>{errorMessage}</p> : ""}
    </div>)
}