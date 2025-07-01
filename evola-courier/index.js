import { createDirectus, staticToken, rest, readItems, createItem, updateItem } from '@directus/sdk';
const directus = createDirectus('')
  .with(staticToken(''))
  .with(rest());



  const a = {
            "id": "311c6969-963e-4095-a254-2d94b003b6b0",
            "acceptor_id": "0",
            "assignee_id": "98684131",
            "availability": "personal",
            "collateral": "28779000000",
            "contract_id": "219771474",
            "date_accepted": null,
            "date_completed": null,
            "date_expired": "2025-07-02T22:46:39Z",
            "date_issued": "2025-06-25T22:46:39Z",
            "days_to_complete": "7",
            "end_location_id": "1038457641673",
            "for_corporation": "false",
            "issuer_corporation_id": "98666541",
            "issuer_id": "2114569240",
            "price": "0",
            "reward": "150000000",
            "start_location_id": "60001030",
            "status": "outstanding",
            "title": "",
            "type": "courier",
            "volume": "325701.0365000002"
        }

const b = {
        "acceptor_id": 0,
        "assignee_id": 98684131,
        "availability": "personal",
        "collateral": 28779000000,
        "contract_id": 219771474,
        "date_expired": "2025-07-02T22:46:39Z",
        "date_issued": "2025-06-25T22:46:39Z",
        "days_to_complete": 7,
        "end_location_id": 1038457641673,
        "for_corporation": false,
        "issuer_corporation_id": 98666541,
        "issuer_id": 2114569240,
        "price": 0,
        "reward": 150000000,
        "start_location_id": 60001030,
        "status": "outstanding",
        "title": "",
        "type": "courier",
        "volume": 325701.0365000002
    }


    function shouldUpdate(a, b) {
	const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);

	for (const key of allKeys) {
		if (key === "id") continue;

		const aHas = key in a;
		const bHas = key in b;

		const aVal = aHas ? String(a[key]) : undefined;
		const bVal = bHas ? String(b[key]) : undefined;

		if (aVal !== bVal) {
			return true; // Something differs
		}
	}

	return false; // No differences
}


    console.log(shouldUpdate(a,b))
/*
  const existing = await directus.request(
		readItems('Contracts', {
			filter: {
				contract_id: {
					_eq: 219813708,
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
        "volume": 330000.000
    };
    // const result = await directus.request(
		// 	createItem('Contracts', {
		// 		...contract
		// 	})
		// );

    //console.log(result);

    contract.title = "udpated";
    contract.volume = "456.456";

    //console.log(result.id)
    
const update = await directus.request(
	updateItem('Contracts', existing[0].id, {
		...contract,
	})
);

console.log(update);*/