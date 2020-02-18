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

exports.test_database_0 = functions.https.onRequest (async (req, res) =>
	{
		try {
			const database = admin.database ();
			
			res.set ('Content-Type', 'application/json');
			return JSON.stringify ({
				ip: req.ip
			});
		}
	}
);

