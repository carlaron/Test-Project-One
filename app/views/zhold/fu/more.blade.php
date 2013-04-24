@layout('template')
@section('title')
Foo More
@endsection
@section('content')
<h1>Foo</h1>
<p>more:<br>
Param one: {{ $one }}<br>
Param two: {{ $two }}<br>
TimeStamp: {{ time() }}</p>
@endsection
