/* -*- tab-width: 4; indent-tabs-mode: t -*- */
/**
	UTokyo 学生自治ドメインプロジェクト

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

import {menhera, MenheraWindowElement} from '/_menhera/index.mjs';

void menhera.addToCache (
	'/_root.mjs'
	,'/index.html'
	,'/resources/u-tokyo_logo.128.png'
	,'/resources/u-tokyo_logo.192.png'
	,'/resources/u-tokyo_logo.256.png'
	,'/resources/u-tokyo_logo.384.png'
	,'/resources/u-tokyo_logo.512.png'
);


const menheraWindow = document.body.appendChild (new MenheraWindowElement);
menheraWindow.addMenuGroup ('account');
menheraWindow.setMenuGroupLabel ('account', 'Guest');
menheraWindow.addMenuItem ('account', 'sign-in', 'ログイン', '/login');

menheraWindow.siteName = 'UTokyo 学生自治ドメイン';
menheraWindow.siteSlogan = '東京大学の学生による学生のための共用ドメイン（大学非公認）';

menhera.menheraWindow.title = '準備中…';

