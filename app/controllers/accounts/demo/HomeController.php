<?php

namespace accounts\demo;

use BaseController;

class HomeController extends BaseController {

	public function index($params=array()){
		
		$account = $params['account'];
		$account_folder = $account->acct_folder;
		//just to demonstrate that demo's home controller is different from the shared one
		//we're going to add a new value $foo to $params, and display it on the demo home page
		$params['bahr'] = "FUBAR";
		return \View::make('accounts.'.$account_folder.'.index', $params);
	}

}