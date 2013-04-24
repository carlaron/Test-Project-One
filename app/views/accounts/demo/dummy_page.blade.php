@extends('accounts.demo.page_tpl')
@section('title')
{{$account->acct_id}} Site "{{$page}}" Page
@stop
@section('content')
    <h1>{{$account->acct_id}} "{{$page}}" Page!</h1>
    <p>Welcome to the {{$account->acct_id}} "{{$page}}" page!</p>
    @if($sub_uri != "")
    <p>The rest of the URI: {{ $sub_uri }}</p>
    @endif
@stop
