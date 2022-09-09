import Config from '../config-service';

const service = {
    async getContracts(content = "") {
        const config = {
            method: 'GET',
            cache: 'no-cache',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain',
                'accept': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        };

        return await fetch(Config.esi_url, config).then(response => {
            return response.json();
        });
    },
};

export default service;