<div id="login_form_div">
  <p class="welcome_text">Welcome, {{$firstname}} {{$lastname}}</p>
  <form id="logout_form" method="post" action="./logout" class="plumform">
        <input type="hidden" id="dest" name="dest" value="{{$dest}}" />
          <p><button type="submit" id="submit">Logout</button></p>
  </form>
</div>                                                              
