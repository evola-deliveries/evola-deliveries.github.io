import { createDirectus, staticToken, rest, readItems, createItem, updateItem } from '@directus/sdk';
const directus = createDirectus('https://api.evolaeve.com:8055')
  .with(staticToken(''))
  .with(rest());



  const existing = await directus.request(
		readItems('Contracts', {
			filter: {
				contract_id: {
					_eq: 2198137051,
				},
			},
		})
	);
    console.log(existing);

    const contract = {
        "acceptor_id": 0,
        "assignee_id": 98684131,
        "availability": "personal",
        "collateral": 900000000,
        "contract_id": 219813708,
        "date_expired": "2025-07-04T05:37:11Z",
        "date_issued": "2025-06-27T05:37:11Z",
        "days_to_complete": 3,
        "end_location_id": 1042490470286,
        "for_corporation": true,
        "issuer_corporation_id": 98688782,
        "issuer_id": 2118666624,
        "price": 0,
        "reward": 100000000,
        "start_location_id": 60003760,
        "status": "outstanding",
        "title": "",
        "type": "courier",
        "volume": 330000
    };
    const result = await directus.request(
			createItem('Contracts', {
				...contract
			})
		);

    console.log(result);

    contract.title = "udpated";
    
const update = await directus.request(
	updateItem('Contracts', result.id, {
		...contract
	})
);

console.log(update);