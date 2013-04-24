@extends('home.page_tpl')
@section('title')
Page Not Found
@stop

@section('content')
			<h2>Server Error: 500 (Internal Server Error)</h2>

			<hr>

			<h3>What does this mean?</h3>

			<p>
				Something went wrong on our servers while we were processing your request.
				We're really sorry about this, and will work hard to get this resolved as
				soon as possible.
			</p>

			<p>
				Perhaps you would like to go to our <a href='/'>home page</a>?
			</p>
@stop
