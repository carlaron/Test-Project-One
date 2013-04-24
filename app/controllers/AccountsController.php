<?php

class AccountsController extends BaseController {

	//in this implementation, the Route sends everything for ANY client page through this controller's "index" method.
	public function index($params)
	{
		// get needed info out of params from Route
		$account = $params['account'];
		$sub_uri = $params['sub_uri'];
		$account_id = $account->acct_id;
		$account_folder = $account->acct_folder;
		
		//make the rest of the URI into an array
		$sub_uri_array = explode("/", trim($sub_uri));
		
		//find page to show from URI array
		if($sub_uri_array[0] != ""){
			//break out the first segment of URI as $page
			$page = $sub_uri_array[0];
			//trim off $page from $sub_uri_array
			array_shift($sub_uri_array);
			$sub_uri = implode("/", $sub_uri_array);
		//default to "home"
		} else {
			$page = "home";
			$sub_uri = "";
		}
		
		//create return url for login and logout functions
		// Different, depending on whether we're at demo.HOSTNAME.COM or HOSTNAME.com/demo
		if(isset($_SERVER['HTTP_X_FORWARDED_HOST'])){
			$dest = 'https://'.$_SERVER["HTTP_X_FORWARDED_HOST"].str_replace("$account_folder","",Request::path());
		} else {
			$dest = Request::url();
		}
		
		//check if they're logged in
		if (Auth::check()){
			//check if they're logged into THIS account's site
			if(Auth::user()->account == $account_id){
			$login_area = View::make('accounts.logged_in',array('firstname'=>Auth::user()->user_firstname,'lastname'=>Auth::user()->user_lastname,'dest'=>$dest));
			//if not log them out and reload the page
			} else {
				Auth::logout();
				return Redirect::to($dest);
			}
		//if not logged in show login form in $login_area
		} else {
			// pull login form from a view
			$login_area = View::make('accounts.login_form',array('account_id'=>$account_id,'dest'=>$dest));
		}
		
		// The page_tpl layout needs these values, so we'll pass them to the page controller in $params
		$params = array(
		'account'=>$account,
		'page'=>$page,
		'sub_uri'=>$sub_uri,
		'login_area'=>$login_area,
		//define these as blank, and fill them in with page controller if appropriate
		'error_dialog'=>"",
		'message_dialog'=>"",
		'docready_js'=>""
		);
				
		//strip out characters from page name that are not allowed in class names
		//or at least in controller names... space, dash, underline... others?
		//means we need to name controllers like the page "slug", but with special chars removed
		//or visa-versa, depending on how you think of it.
		$page = ereg_replace("[ -_+]", "", $page);

		//find if $page controller exists in accounts/$account_folder
		if(file_exists("../app/controllers/accounts/".$account_folder."/".ucfirst($page)."Controller.php")){
			$controller = "accounts\\".$account_folder."\\".ucfirst($page)."Controller";
			return App::make($controller)->{'index'}($params);
		//or find one in accounts/_shared folder
		} elseif(file_exists("../app/controllers/accounts/shared/".ucfirst($page)."Controller.php")){
			$controller = "accounts\\shared\\".ucfirst($page)."Controller";
			return App::make($controller)->{'index'}($params);
		//or show 404
		} else {
			App::abort(404, "Page $page not found. ($page/$sub_uri)");
			//return "account page fail | $page | $sub_uri";
		}
		
		
		
	}


}