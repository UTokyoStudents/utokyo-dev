/* -*- tab-width: 4; indent-tabs-mode: t; -*- */
/**
	Copyright (C) 2020  東京大学教養学部学生自治会

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/


const admin = require ('firebase-admin');
const functions = require ('firebase-functions');

const express = require ('express');
const app = express ();


const serviceAccount = require ('./utokyo-dev_service-account-key.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://utokyo-dev.firebaseio.com"
});


const AUTH_PREFIX = 'Bearer ';
const TRUSTED_PROXIES = ['34.85.106.248'];

const pton = ip => {
	if (!ip.match (/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/)) {
		throw new Error ('Not an IPv4 address');
	}
	
	const segments = ip.split ('.');
	return (segments[0] << 24) | (segments[1] << 16) | (segments[2] << 8) | Number (segments[3]);
};

const compare_ip = (n, ip1, ip2) => {
	let mask = 0x0;
	for (let i = 0; i < 32 && i < n; i++) {
		mask |= 0x1 << (31 - i);
	}
	
	const ip1_n = pton (ip1);
	const ip2_n = pton (ip2);
	
	return (ip1_n & mask) === (ip2_n & mask);
};

const is_internal = ip =>
	compare_ip (16, '130.69.0.0', ip)
		|| compare_ip (16, '133.11.0.0', ip)
		|| compare_ip (16, '157.82.0.0', ip)
		|| compare_ip (20, '192.51.208.0', ip);

exports.is_utnet = functions.https.onRequest (async (req, res) =>
	{
		let ip = String (req.ip).trim ();
		
		if (TRUSTED_PROXIES.includes (ip) && req.headers.menheraRealIp) {
			ip = String (req.headers.menheraRealIp).trim ();
		}
		
		let internal = false;
		try {
			internal = is_internal (ip);
		} catch (ex) {
			internal = false;
		}
		
		res.set ('Content-Type', 'application/json');
		res.send (JSON.stringify ({
			ip_address: ip,
			is_internal: internal,
		}));
	}
);

exports.find_subdomain = functions.https.onRequest (async (req, res) =>
	{
		const ip = String (req.ip);
		
		let internal = false;
		try {
			internal = is_internal (ip);
		} catch (ex) {
			internal = false;
		}
		
		res.set ('Content-Type', 'application/json');
		res.send (JSON.stringify ({
			ip_address: ip,
			is_internal: internal,
		}));
	}
);

exports.test_auth_0 = functions.https.onRequest (async (req, res) =>
	{
		const data = {};
		
		try {
			if (!req.query.token) {
				throw new Error ('Unauthorized request');
			}
			
			const idToken = req.query.token.trim ();
			const auth = admin.auth ();
			const decodedToken = await auth.verifyIdToken (idToken);
			data.uid = decodedToken.uid;
		} catch (e) {
			//
		}
		
		res.set ('Content-Type', 'application/json');
		res.send (JSON.stringify (data));
	}
);

exports.test_database_0 = functions.https.onRequest (async (req, res) =>
	{
		
		try {
			const database = admin.database ();
			
			//const trueip = req.get ('fastly-client-ip');
			const ip = req.ip;
			
			const internal = is_internal (ip);
			
			
			const authorization = req.get ('Authorization');
			if ((!authorization) || (!authorization.startWith (AUTH_PREFIX))) {
				
			}
			
			res.set ('Content-Type', 'application/json');
			res.send (JSON.stringify ({
				ip: req.ip,
				internal
			}));
			
			
			const token = req.param ('token');
		} catch (e) {
			res.set ('Content-Type', 'application/json');
			res.send (JSON.stringify ({
				error: String (e)
			}));
		}
	}
);

