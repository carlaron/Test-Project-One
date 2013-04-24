<html>
	<head>
		<title>@yield('title')</title>
		<meta name="description" content="{meta_description}" />

		<!-- as much as possible, I don't think we should duplicate code that's running from the root CSS directories...
		if we need to, we can always overwrite, but there's no reason for these not to be globally accessible -->

		<!--reset stylesheet sets up basic defaults-->
		<link rel="stylesheet" type="text/css" href="/css/reset.css" media="screen" />

		<!--text stylesheet sets up fonts sizes, colors of text-->
		<!--ALSO THIS IS USED BY WYSIWYG Editor -->
		<link rel="stylesheet" type="text/css" href="/css/text.css" media="screen" />

		<!--Load base CSS file-->
		<link rel="stylesheet" type="text/css" href="/accounts/demo/css/style.css" media="screen" />

		<!--960 stylesheet sets 960 grid layout system -->
		<link rel="stylesheet" type="text/css" href="/css/960.css" media="screen" />

		<!-- Download jQuery from Google's SSL CDN -->
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>

		<!-- Download jQuery UI from Google's SSL CDN -->
		<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
		<link rel="stylesheet" type="text/css" href="/css/jquery-ui-flick/jquery-ui-1.9.2.custom.css" />
		<link rel="stylesheet" type="text/css" href="/accounts/demo/css/jquery-ui-local-overrides.css" />

		<!-- jqNotify -->
		<script type="text/javascript" src="/js/jqnotify-1.0/jquery.jqnotify-1.0.js"></script>
		<link rel="stylesheet" type="text/css" href="/js/jqnotify-1.0/js-notify.css" />

		<!--Plum Form JS and Styling JS from shared site JS folder, and CSS crom client local CSS folder-->
		<script type="text/javascript" src="/js/plumform-1.5.2/js/jquery.plum.form.js"></script>
		<link rel="stylesheet" type="text/css" href="/css/plumform/default.css" />

		<!-- Final overrides -->
		<link rel="stylesheet" type="text/css" href="/css/elements.css" media="screen" />
		<link rel="stylesheet" type="text/css" href="/css/jquery-ui-local-overrides.css" />
		<link rel="stylesheet" type="text/css" href="/css/management-console.css" media="screen" />
		<link rel="stylesheet" type="text/css" href="/css/plumform-overrides.css" media="screen" />
		<link rel="stylesheet" type="text/css" href="/css/products.css" media="screen" />

		<!--docready script actions -->
		<script>
			// increase the default animation speed to exaggerate the effect
			$(function() {
				// set up div#error_dialog as a Jquery Dialog
				$( "#error_dialog" ).dialog({
					title: 'Error / Debug Info',
					autoOpen: false,
					position:['center',20],
					width: 800,
					height: 600,
					modal: true
				});

				// set up div#message_dialog as a Jquery Dialog
				$( "#message_dialog" ).dialog({
					title: 'Message',
					autoOpen: false,
					position:['center',20],
					width: 'auto',
					height: 'auto',
					modal: true
				});

				// Apply Plum Form Styling to class "plumform"
				$('.plumform').plum('form');

				// format .button class using same plum form buttons as buttons in forms.
				// but use .not() to avaoid double "plumming" them.
//				$('.button').not('.plumform').plum('form');

				// jquery-ui menu
				$('#menu_ul').menu({ "position": { "my": "left top", "at": "center center" } });

				// TODO: this seems to be somewhat broken in jQueryUI 1.9x
				// jq menu focus on current active page
//				$("#menu_ul").menu("focus", null, $("#menu_ul").find(".current:first"));

				// jq menu refocus on current active page when mouse leaves menu
//				$( "#menu_ul" ).on( "menublur", function() {
//					$( "#menu_ul" ).menu( "focus", null, $('#menu_ul').find( ".current" ) );
//				});

				//-------------------------------------------------------------------------------------------------
				// message and error dialogs

				// Open the message dialog if there's anything in it.
				if ($("#message_dialog").html().length > 0) {
					$("#message_dialog").dialog("open");
				}

				// Open the error dialog if there's anything in it.
				if ($("#error_dialog").html().length > 0) {
					$("#error_dialog").dialog("open");
				}

				// open the error_dialog when anything ID error_opener is clicked
				$("#error_opener").click(function() {
					if ($("#error_dialog").is(":visible")) {
						$("#error_dialog").dialog("close");
					} else {
						$("#error_dialog").dialog("open");
					}
					return false;
				});

				// open the message_dialog when anything ID message_opener is clicked
				$("#message_opener").click(function() {
					if ($("#message_dialog").is(":visible")) {
						$("#message_dialog").dialog("close");
					} else {
						$("#message_dialog").dialog("open");
					}
					return false;
				});

				if ($("#message_dialog").html() == "") {
					$("#message_opener").css("opacity", "0.3")
				}
				if ($("#error_dialog").html() == "") {
					$("#error_opener").css("opacity", "0.3")
				}

				//-------------------------------------------------------------------------------------------------
				// tag for merging in individual PHP pages to insert additional docready JS code
				@if($docready_js != "")
				{{$docready_js}}
				@endif

			});
		</script>
		<style type="text/css">
			/* Description */
			.opener {
				position: fixed;
				width: 16px;
				height: 16px;
				bottom: 10px;
				cursor: pointer;
				z-index: 99999;
			}
			.opener:hover {
				opacity: 1.0;
			}
			#message_opener {
				background-image: url('/images/icons/information.png');
				right: 40px;
			}
			#error_opener {
				background-image: url('/images/icons/exclamation-red.png');
				right: 14px;
			}
			#error_dialog {
				font-size: 12px;
			}
			#error_dialog hr {
				margin-top: 5px;
				margin-bottom: 5px;
			}
			{embed_style}
		</style>
	</head>
	<body>
		<!--// hidden divs that are used for pop-up dialogs // -->
		<div id="error_dialog" style="display:none;">@if($error_dialog != "")
		{{$error_dialog}}
		@endif</div>
		<div id="message_dialog" style="display:none;">@if($message_dialog != "")
		{{$message_dialog}}
		@endif</div>
		<div class="opener" id="message_opener"></div>
		<div class="opener" id="error_opener"></div>

		<!--the whole "page" should be inside this container div-->
		<div id="container">

			<!--page header / masthead with background, logo, and login form-->
			<div id="header">
				<a id="logo" href="/demo">Demo Account Site<br /><span style="font-size: 18px;">This will be different for every client</span></a>
				<div id="login_area">{{$login_area}}</div>
			</div><!--end header div-->

			<!--menu div contains ul/li that is formatted by jquery ui-->
			<div id="menu">
				@include('accounts.menu')
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

		<div id="dialog-modal" title="Basic modal dialog" class="jqueryui_dialog">
			<img src="/images/loading-transparent.gif" style="position: relative; top: 50%; left: 50%;" />
		</div>

	</body>
</html>
