// import { createDirectus, staticToken, rest, readItems, createItem, updateItem } from '@directus/sdk';
// const directus = createDirectus('')
//   .with(staticToken(''))
//   .with(rest());



//   const a = {
//             "id": "311c6969-963e-4095-a254-2d94b003b6b0",
//             "acceptor_id": "0",
//             "assignee_id": "98684131",
//             "availability": "personal",
//             "collateral": "28779000000",
//             "contract_id": "219771474",
//             "date_accepted": null,
//             "date_completed": null,
//             "date_expired": "2025-07-02T22:46:39Z",
//             "date_issued": "2025-06-25T22:46:39Z",
//             "days_to_complete": "7",
//             "end_location_id": "1038457641673",
//             "for_corporation": "false",
//             "issuer_corporation_id": "98666541",
//             "issuer_id": "2114569240",
//             "price": "0",
//             "reward": "150000000",
//             "start_location_id": "60001030",
//             "status": "outstanding",
//             "title": "",
//             "type": "courier",
//             "volume": "325701.0365000002"
//         }

// const b = {
//         "acceptor_id": 0,
//         "assignee_id": 98684131,
//         "availability": "personal",
//         "collateral": 28779000000,
//         "contract_id": 219771474,
//         "date_expired": "2025-07-02T22:46:39Z",
//         "date_issued": "2025-06-25T22:46:39Z",
//         "days_to_complete": 7,
//         "end_location_id": 1038457641673,
//         "for_corporation": false,
//         "issuer_corporation_id": 98666541,
//         "issuer_id": 2114569240,
//         "price": 0,
//         "reward": 150000000,
//         "start_location_id": 60001030,
//         "status": "outstanding",
//         "title": "",
//         "type": "courier",
//         "volume": 325701.0365000002
//     }


//     function shouldUpdate(a, b) {
// 	const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);

// 	for (const key of allKeys) {
// 		if (key === "id") continue;

// 		const aHas = key in a;
// 		const bHas = key in b;

// 		const aVal = aHas ? String(a[key]) : undefined;
// 		const bVal = bHas ? String(b[key]) : undefined;

// 		if (aVal !== bVal) {
// 			return true; // Something differs
// 		}
// 	}

// 	return false; // No differences
// }


//     console.log(shouldUpdate(a,b))
// /*
//   const existing = await directus.request(
// 		readItems('Contracts', {
// 			filter: {
// 				contract_id: {
// 					_eq: 219813708,
// 				},
// 			},
// 		})
// 	);
//     console.log(existing);

//     const contract = {
//         "acceptor_id": 0,
//         "assignee_id": 98684131,
//         "availability": "personal",
//         "collateral": 900000000,
//         "contract_id": 219813708,
//         "date_expired": "2025-07-04T05:37:11Z",
//         "date_issued": "2025-06-27T05:37:11Z",
//         "days_to_complete": 3,
//         "end_location_id": 1042490470286,
//         "for_corporation": true,
//         "issuer_corporation_id": 98688782,
//         "issuer_id": 2118666624,
//         "price": 0,
//         "reward": 100000000,
//         "start_location_id": 60003760,
//         "status": "outstanding",
//         "title": "",
//         "type": "courier",
//         "volume": 330000.000
//     };
//     // const result = await directus.request(
// 		// 	createItem('Contracts', {
// 		// 		...contract
// 		// 	})
// 		// );

//     //console.log(result);

//     contract.title = "udpated";
//     contract.volume = "456.456";

//     //console.log(result.id)
    
// const update = await directus.request(
// 	updateItem('Contracts', existing[0].id, {
// 		...contract,
// 	})
// );

// console.log(update);*/
// const meh = 

// import fetch from 'node-fetch';
// const { data } = meh;

// const unique = Array.from(
//   new Map(data.map(item => [item.corporation_id, item])).values()
// );

// const API_URL = 'http://localhost:3000/corporation'; // Adjust if needed

// async function postMember(corporation_id) {
//   try {
//     const res = await fetch(API_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ corporation_id: corporation_id })
//     });

//     if (!res.ok) {
//       console.warn(`[WARN] Failed for ${corporation_id} (${res.status})`);
//     } else {
//       console.log(`[OK] Queued ${corporation_id}`);
//     }
//   } catch (err) {
//     console.error(`[ERROR] ${corporation_id}`, err.message);
//   }
// }

// async function processAll() {
//   for (const entry of unique) {
//     if (!entry.corporation_id) continue;
//     await postMember(entry.corporation_id);
//   }
// }

// processAll();

// function shouldUpdate(existing, incoming) {
//     const ignoredKeys = ['id', 'character_id', 'description'];

//     for (const key of Object.keys(incoming)) {
//         if (ignoredKeys.includes(key)) continue;

//         if (!(key in existing)) return true;

//         const existingVal = existing[key];
//         const incomingVal = incoming[key];

//         // Convert both to string for loose comparison
//         if (String(existingVal ?? '') !== String(incomingVal ?? '')) {
//             return true;
//         }
//     }

//     return false;
// }


// const a = {
//             "id": "007c0bdc-992e-426d-a843-f5db6ecf8abe",
//             "character_id": "445896262",
//             "name": "khufo",
//             "birthday": "2006-12-20T06:52:00Z",
//             "bloodline_id": "3",
//             "corporation_id": "98558506",
//             "gender": "male",
//             "race_id": "2",
//             "security_status": "5.001715627"
//         };

// const b = {
//     "alliance_id": 99005338,
//     "birthday": "2006-12-20T06:52:00Z",
//     "bloodline_id": 3,
//     "corporation_id": 98558506,
//     "description": "<font size=\"15\" color=\"#bfffffff\"></font><font size=\"36\" color=\"#ff4c4c4c\">CHEOPS......./\\</font><font size=\"18\" color=\"#ff4c4c4c\">/\\</font><font size=\"12\" color=\"#ff4c4c4c\">/\\</font>",
//     "gender": "male",
//     "name": "khufo",
//     "race_id": 2,
//     "security_status": 5.001715627
// };

// console.log(shouldUpdate(a, b))