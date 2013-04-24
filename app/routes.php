<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

//basic straight-forward page with template (home.index) in layout (home.page_tpl)
// with layout hard-coded into home.index with @layout('home.page_tpl')
Route::get('/', function()
{
	return View::make('home.index');
});

Route::get('test', function()
{
	return View::make('home.test');
});


//Get all client accounts with Account model
$accounts = Account::all();

//foreach account_id set up Route for account's site
foreach($accounts as $account_route_account){
	//routes with account_id as folder
	$account_route_folder = $account_route_account->acct_folder;
	//account login/logout routes
	Route::any($account_route_folder.'/logout', function() use ($account_route_folder){
		Auth::logout();
		return Redirect::to(Input::get('dest'));
	});
	//login
	Route::post($account_route_folder.'/login', function() use ($account_route_folder){
	    $userdata = array(
	        'user_email' => Input::get('user_email'),
	        'password'=> Input::get('password'),
	        'account' => Input::get('account_id')        
	    );
		Auth::attempt($userdata);
		return Redirect::to(Input::get('dest'));
	});
	Route::get($account_route_folder.'/{sub_uri?}', function($sub_uri = "") use ($account_route_account) {
		//why? because I like to have phpinfo handy.
		if($sub_uri == "php411/letcpin"){
			return phpinfo();
		} else {
			//return generic Account Controller, which will 
			return App::make('AccountsController')->{'index'}(array('account'=>$account_route_account,'sub_uri'=>$sub_uri));
		}
	})->where('sub_uri', '(.*)');
	
}

//test routes for testing setting and getting Session and cookie values
Route::get('set', function(){
    Session::flush();
    Session::put('test', 'working '.time());
	 $cookie = Cookie::make('testcookie', 'workingcookie '.time(), 180);
	 //OK this is weird.. we have to make() the cookie then include it in response
	 //instead of just using Cookie::put() ... ???
    return Redirect::to('get')->withCookie($cookie);
});

Route::get('get', function(){
    return "This should say 'working' plus the timestamp: ".Session::get('test')."<br>This should say 'workingcookie' plus the timestamp: ".Cookie::get('testcookie')."<br><a href='set'>do it again</a>";
});
