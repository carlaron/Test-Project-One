<div id="login_form_div">
        <form id="login_form" method="post" action="./login" class="plumform">
        <input type="hidden" id="dest" name="dest" value="{{$dest}}" />
        <input type="hidden" id="account_id" name="account_id" value="{{$account_id}}" />
                <fieldset>
                        <legend>Log In</legend>
                        <ul>  
                        <li><label for="user_email">Username</label>
                                <input type="text" id="user_email" name="user_email" size="20" value="test@test.com" /></li>
                        <li><label for="password">Password</label>
                                <input type="password" id="password" name="password" size="20" value="testpass" /></li>
                        <li><label for="submit"></label>
                                <button type="submit" id="submit">Login</button></li>
                        <ul>
                </fieldset>
        </form>  
</div>
