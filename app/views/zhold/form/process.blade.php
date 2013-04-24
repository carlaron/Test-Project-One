@layout('template')
@section('title')
Form
@endsection

@section('content')
    <h1>Your Form Results!</h1>
    <p>Here's what you entered!</p>
    <p><b>Full Name</b> {{$full_name}}</p>
    <p><b>Email</b> {{$email}}</p>
@endsection
