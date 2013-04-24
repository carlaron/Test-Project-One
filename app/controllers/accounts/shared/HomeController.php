<?php

namespace accounts\shared;

use BaseController;

class HomeController extends BaseController {

	public function index($params=array()){
		$account = $params['account'];
		$account_id = $account->acct_id;
		$account_folder = $account->acct_folder;
		// NOTE THAT View has a backslash... that's because, to get this Controller
		// to work in a sub-folder, we had to make it in it's own fucking Namespace
		// I banged my head against the wall for over a day to find a syntaxt that would
		// let me call a Controller inside a folder, and NOTHING ELSE WORKED.
		// and now we need the REAL fucking namespace that EVERY OTHER FUCKING THING is defined in.
		return \View::make('accounts.'.$account_folder.'.index', $params);
	}

}