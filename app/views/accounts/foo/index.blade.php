@extends('accounts.foo.page_tpl')
@section('title')
Foo Site Home Page
@stop
@section('content')
    <h1>Foo Home!</h1>
    <p>Welcome to the Foo Home page!</p>
        <?php echo $sub_uri ?>
@stop
