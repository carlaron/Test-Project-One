@extends('accounts.demo.page_tpl')
@section('title')
Demo Site Home Page
@stop
@section('content')
    <h1>Home!</h1>
    <p>Welcome to the Demo Home page!</p>
    <p>Between these parenthesis ({{ $bahr }}) is a place to put the value of the variable $bahr, which the accounts/demo/HomeController.php controller adds to $params, just to demonstrate that demo's home controller overrides the shared home controller.</p>
    {{ $sub_uri }}
@stop
