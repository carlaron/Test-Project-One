@section('title')
Page Not Found!
@stop

@section('content')
	<h2>Server Error: 404 (Not Found)</h2>

	<hr>

	<h3>What does this mean?</h3>

	<p>
		We couldn't find the page you requested ({{$uri}}) on our servers. We're really sorry
		about that. It's our fault, not yours. We'll work hard to get this page
		back online as soon as possible.
	</p>

	<p>
		Perhaps you would like to go to our <a href='/'>home page</a>?
	</p>
@stop
