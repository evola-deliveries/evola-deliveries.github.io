import { reduceRight } from 'lodash';
import Config from '../config-service';

const service = {
    async getAppraisal(content = "") {
        const config = {
            method: 'POST',
            cache: 'no-cache',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain',
                'accept': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: content
        };
        console.log(Config.janice_api_url);
        return await fetch(Config.evola_api_url, config).then(response => {
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            return response.json();
        });
    },
    getTotalVolume(result) {
        if (result === undefined) return;

        return reduceRight(result.items, (number, item) => {
            return number + (item.itemType.packagedVolume * item.amount);
        }, 0);
    }
};

export default service;