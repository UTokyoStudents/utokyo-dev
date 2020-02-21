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

import {menhera, MenheraWindowElement, NavigationTarget} from '/_menhera/index.mjs';

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
menheraWindow.addMenuGroup ('account_menu');
menheraWindow.setMenuGroupLabel ('account_menu', 'Guest');
menheraWindow.addMenuItem ('account_menu', 'home', 'ホーム', '/');
menheraWindow.addMenuItem ('account_menu', 'sign_in', 'ログイン', '/login');

firebase.auth ().onAuthStateChanged (user =>
	{
		if (!user) {
			menheraWindow.removeMenuGroup ('domain_menu');
			menheraWindow.removeMenuItem ('account_menu', 'settings');
			menheraWindow.setMenuGroupLabel ('account_menu', 'Guest');
			menheraWindow.addMenuItem ('account_menu', 'sign_in', 'ログイン', '/login');
			menhera.triggerNavigation (new NavigationTarget ('/'), window, true);
		} else {
			menheraWindow.removeMenuItem ('account_menu', 'sign_in');
			menheraWindow.setMenuGroupLabel ('account_menu', user.displayName);
			menheraWindow.addMenuItem ('account_menu', 'settings', '設定', '/settings');
			menheraWindow.addMenuGroup ('domain_menu');
			menheraWindow.setMenuGroupLabel ('domain_menu', 'ドメイン');
			menheraWindow.addMenuItem ('domain_menu', 'subdomains', 'サブドメイン一覧', '/subdomains');
			
		}
	}
);

menheraWindow.siteName = 'UTokyo 学生自治ドメイン';
menheraWindow.siteSlogan = '東京大学の学生による学生のための共用ドメイン（大学非公認）';

menheraWindow.title = '準備中…';


top.addEventListener ('MenheraNavigate', ({detail}) =>
	{
		const {target, view} = detail;
		if ('/' === target.path) {
			
		}
	}
);

