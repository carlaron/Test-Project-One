<html>
	<head>
		<title>@yield('title')</title>
		<meta name="description" content="<!--meta_description-->" />

		<!--reset stylesheet sets up basic defaults-->
		<link rel="stylesheet" type="text/css" href="/css/reset.css" media="screen" />

		<!--text stylesheet sets up fonts sizes, colors of text-->
		<!--ALSO THIS IS USED BY WYSIWYG Editor -->
		<link rel="stylesheet" type="text/css" href="/css/text.css" media="screen" />

		<!--Local client-specific CSS stylesheet defines layout and everything else, -->
		<link rel="stylesheet" type="text/css" href="/css/style.css" media="screen" />

		<!--960 stylesheet sets 960 grid layout system -->
		<link rel="stylesheet" type="text/css" href="/css/960.css" media="screen" />

		<!--jQuery ROCKS load from SSL CDN -->
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>

		<!--JQuery UI ROCKS get JS from SSL CDN, and CSS from Client/Local file-->
		<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
		<link rel="stylesheet" type="text/css" href="/css/jquery-ui-flick/jquery-ui-1.9.2.custom.css" />
		<link rel="stylesheet" type="text/css" href="/css/jquery-ui-local-overrides.css" />

		<!--Plum Form JS and Styling JS from shared site JS folder, and CSS crom client local CSS folder-->
		<script type="text/javascript" src="/js/plumform-1.5.2/js/jquery.plum.form.js"></script>
		<link rel="stylesheet" type="text/css" href="/css/plumform/default.css" />

		<!--docready script actions -->
		<script>
			// increase the default animation speed to exaggerate the effect
			$(function() {
				//set up div#error_dialog as a Jquery Dialog
				$( "#error_dialog" ).dialog({
					title: 'Error / Debug Info',
					autoOpen: false,
					position:['center',20],
					width: 800,
					height: 600,
					modal: true
				});

				//set up div#message_dialog as a Jquery Dialog
				$( "#message_dialog" ).dialog({
					title: 'Message',
					autoOpen: false,
					position:['center',20],
					width: 'auto',
					height: 'auto',
					modal: true
				});

				//Apply Plum Form Styling to class "plumform"
//				$('.plumform').plum('form');

				//format .button class using same plum form buttons as buttons in forms.
				//but use .not() to avaoid double "plumming" them.
				$('.button').not('.plumform').plum('form');

				//jquery-ui menu
				$('#menu_ul').menu({ position: { my: "left top", at: "center center" } });

				//jq menu focus on current active page
				$( "#menu_ul" ).menu( "focus", null, $('#menu_ul').find( ".current" ) );

				//jq menu refocus on current active page when mouse leaves menu
				$( "#menu_ul" ).on( "menublur", function() {
					$( "#menu_ul" ).menu( "focus", null, $('#menu_ul').find( ".current" ) );
				});

				//tag for merging in individual PHP pages to insert additional docready JS code  
				@yield('docready_js')

			});
		</script>

	</head>
	<body>
		<!--//hidden divs that are used for pop-up dialogs //-->
		<div id="error_dialog" style="display:none;">@yield('error_dialog')</div>
		<div id="message_dialog" style="display:none;">@yield('message_dialog')</div>

		<!--the whole "page" should be inside this container div-->
		<div id="container">

			<!--page header / masthead with background, logo, and login form-->
			<div id="header">
				<div id="logo">Eportal Main Page<br /><span style="font-size: 18px;">Includes branding and whatnot</span></div>
			</div><!--end header div-->

			<!--menu div contains ul/li that is formatted by jquery ui-->
			<div id="menu">
				@include('home.menu')
			</div><!--end menu div-->

			<!--main content div is class container_12 from grid960 system-->
			<div id="content" class="container_12">
				@yield('content')
			</div><!--end content div-->

			<!--page footer here-->
			<div id="footer">
				&copy; Commpartners <script type="text/javascript">var d=new Date(); yr=d.getFullYear(); document.write(yr);</script>
			</div><!--end footer div-->

		</div><!--end container div-->
		<div style=" background:#ddd; position: absolute; right:0; bottom:0; font-size:16px;"><!--view_error_button--></div>
	</body>
</html>
