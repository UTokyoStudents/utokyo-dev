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

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const serviceAccount = require ('./utokyo-dev_service-account-key.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://utokyo-dev.firebaseio.com"
});

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

exports.test_database_0 = functions.https.onRequest (async (req, res) =>
	{
		try {
			const database = admin.database ();
			
			const trueip = req.get ('fastly-client-ip');
			const ip = req.ip;
			
			const internal = compare_ip (16, '130.69.0.0', ip)
				|| compare_ip (16, '133.11.0.0', ip)
				|| compare_ip (16, '157.82.0.0', ip)
				|| compare_ip (20, '192.51.208.0', ip);
			
			const segments = ip.split ('.');
			const ip_n = (segments[0] << 24) | (segments[1] << 16) | (segments[2] << 8) | Number (segments[3]);
			res.set ('Content-Type', 'application/json');
			res.send (JSON.stringify ({
				ip: req.ip,
				ips: req.ips,
				internal,
				trueip
			}));
			
		} catch (e) {
			res.set ('Content-Type', 'application/json');
			res.send (JSON.stringify ({
				error: String (e)
			}));
		}
	}
);

