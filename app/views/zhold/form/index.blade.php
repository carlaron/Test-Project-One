@layout('template')
@section('title')
Form
@endsection

@section('content')
    <h1>A Form!</h1>
    <p>Welcome to the Form page!</p>
    <form method="post" action="/form/process">
    	<fieldset style='border:1px solid #cacaca; padding: 10px;'>
    	<legend>Please Fill In and Submit to see the Result</legend>
    	<ul style="margin:0; padding:0; list-style:none;">
    		<li><label for="full_name">Full Name</label> <input name="full_name" type="text" size="30"></li>
    		<li><label for="email">Email</label> <input name="email" type="text" size="30"></li>
    	<ul>
    	<input name="what_to_do" type="submit" value="Submit">
    	</fieldset>
    </form>

@endsection
