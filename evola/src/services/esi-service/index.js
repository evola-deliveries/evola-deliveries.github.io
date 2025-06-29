import Config from '../config-service';

const service = {
    async getContracts(content = "") {
        const fetchConfig = {
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

        return await fetch(`${Config.evola_api_root_url}/getContracts`, fetchConfig).then(response => {
            return response.json();
        });
    },
};

export default service;