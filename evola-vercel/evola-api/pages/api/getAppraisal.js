// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import Cors from 'cors'

const options = {
	origin: ["http://localhost:3000", "http://localhost:5000", "http://192.168.1.171:5000"],
	methods: ['GET', 'OPTIONS', 'POST'],
};

const cors = Cors(options);

function isString(s) {
	return typeof s === 'string' || s instanceof String;
}

function isOriginAllowed(origin, allowedOrigin) {
	if (Array.isArray(allowedOrigin)) {
		for (var i = 0; i < allowedOrigin.length; ++i) {
			if (isOriginAllowed(origin, allowedOrigin[i])) {
				return true;
			}
		}
		return false;
	} else if (isString(allowedOrigin)) {
		return origin === allowedOrigin;
	} else if (allowedOrigin instanceof RegExp) {
		return allowedOrigin.test(origin);
	} else {
		return !!allowedOrigin;
	}
}

function runMiddleware(req, res, fn) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result)
			}

			return resolve(result)
		})
	})
}

const handler = async (req, res) => {
	await runMiddleware(req, res, cors);

	axios(
		{
			url: 'https://janice.e-351.com/api/rest/v2/appraisal?market=2&designation=appraisal&pricing=split&pricingVariant=immediate&persist=true&compactize=false&pricePercentage=1',
			method: 'POST', // default
			headers: {
				'accept': 'application/json',
				'X-ApiKey': process.env.APIKEY,
				'Content-Type': 'text/plain'
			},
			data: req.body,
			timeout: 2000, // default is `0` (no timeout)
		}
	).then((result) => {
		if (!isOriginAllowed(req.headers.origin, options.origin)) {
			res.setHeader('Access-Control-Allow-Methods', options.methods.join(','))
				.status(200).json(result.data);
		} else {
			res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
				.setHeader('Access-Control-Allow-Methods', options.methods.join(','))
				.status(200).json(result.data);
		}
	}).catch(function (error) {
		res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
			.setHeader('Access-Control-Allow-Methods', options.methods.join(','))
			.status(400).json({ message: error.message })
	});
}

export default handler