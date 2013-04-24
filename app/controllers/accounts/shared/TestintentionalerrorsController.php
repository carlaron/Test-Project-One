<?php

namespace accounts\shared;

use BaseController;

class TestintentionalerrorsController extends BaseController {

	public function index($params=array()){
		$account = $params['account'];
		$account_id = $account->acct_id;
		$account_folder = $account->acct_folder;
		
		$params['error_dialog'] = "This is a Fake PHP Error Message";
		// NOTE THAT View has a backslash... that's because, to get this Controller
		// to work in a sub-folder, we had to make it in it's own fucking Namespace
		// I banged my head against the wall for over a day to find a syntaxt that would
		// let me call a Controller inside a folder, and NOTHING ELSE WORKED.
		// and now we need the REAL fucking namespace that EVERY OTHER FUCKING THING is defined in.
		// so we need the backslash to say we don't mean the stupid pointless namespace we had to make
		return \View::make('accounts.'.$account_folder.'.dummy_page', $params);
	}

}