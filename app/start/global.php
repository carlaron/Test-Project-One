<?php

/*
|--------------------------------------------------------------------------
| Register The Laravel Class Loader
|--------------------------------------------------------------------------
|
| In addition to using Composer, you may use the Laravel class loader to
| load your controllers and models. This is useful for keeping all of
| your classes in the "global" namespace without Composer updating.
|
*/

ClassLoader::addDirectories(array(

	app_path().'/commands',
	app_path().'/controllers',
	app_path().'/models',
	app_path().'/database/seeds',

));

/*
|--------------------------------------------------------------------------
| Application Error Logger
|--------------------------------------------------------------------------
|
| Here we will configure the error logger setup for the application which
| is built on top of the wonderful Monolog library. By default we will
| build a rotating log file setup which creates a new file each day.
|
*/

$logFile = 'log-'.php_sapi_name().'.txt';

Log::useDailyFiles(storage_path().'/logs/'.$logFile);

/*
|--------------------------------------------------------------------------
| Application Error Handler
|--------------------------------------------------------------------------
|
| Here you may handle any errors that occur in your application, including
| logging them or displaying custom views for specific errors. You may
| even register several error handlers to handle different types of
| exceptions. If nothing is returned, the default error view is
| shown, which includes a detailed stack trace during debug.
|
*/

App::error(function(Exception $exception, $code)
{
	Log::error($exception);
});

App::missing(function($exception)
{
	//get URI for display on 404 page
	$uri = Request::path();
	
	//params to pass on to page template
	$params = array(
	'uri'=>$uri,
	'login_area'=>"",
	'error_dialog'=>"",
	'message_dialog'=>"",
	'docready_js'=>""
	);

	//if this is a client account page URI
	if(is_dir(app_path().'/views/accounts/'.Request::segment(1))){
		$account = Account::where('acct_folder','=',Request::segment(1))->first();
		$params = array(
		'account' => $account,
		'login_area'=>"",
		'error_dialog'=>"",
		'message_dialog'=>"",
		'docready_js'=>""
		);
		$layout_404 = View::make('accounts.'.Request::segment(1).'.page_tpl',$params);
		return $layout_404->nest('content', 'error.404',array('uri'=>$uri));
	//else if this is a regular non-client-account page URI
	} else {
		$layout_404 = View::make('home.page_tpl');
		return $layout_404->nest('content', 'error.404',array('uri'=>$uri));
	}
});

/*
App::missing(function($exception)
{
    return "Page not found... Added this 'missing' handler but to /start/global... not sure if that's a really where it should be. This should already exist somewhere else, but Laravel 4 seems to not really be close to done.";
});
*/

/*
|--------------------------------------------------------------------------
| Require The Filters File
|--------------------------------------------------------------------------
|
| Next we will load the filters file for the application. This gives us
| a nice separate location to store our route and application filter
| definitions instead of putting them all in the main routes file.
|
*/

require __DIR__.'/../filters.php';