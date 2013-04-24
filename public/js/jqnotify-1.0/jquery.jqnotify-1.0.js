/*
 * jQuery Notify
 * version 1.0
 *
 * libnotify-style jQuery notifications
 *
 * 2012 Colin McCann - me@colinmccann.com
 * Free to modify, use, distribute, etc.
 * 
 */

	// CREATE NOTIFICATION FUNCTION ************************************************************************************/
	function jqnotify(text, type, timeout) {

		// check text
		if (!text) { text = "[empty]"; }

		// check type
		if (type in {"info":"", "warning":"","success":"","failure":""}) {
			classname = "notify-"+type;
		} else {
			classname = "notify-info";
		}

		// compute timeout
		timeout = (typeof(timeout) == 'number') ? timeout : false ;
		if (!timeout) {
			var len = text.length;
			timeout = len * 20;
			timeout = (timeout < 2000) ? 2000 : timeout ;
		}

		// Check for proper structure
		if ($("#jqnotifications").length == 0) {
			$("body").prepend('<div id="jqnotifications"></div>');
		}

		// Output HTML
		var id = new Date();
			id = "x"+id.getTime();
		var str = '<div class="'+classname+'" id="'+id+'"><div class="indicator"></div>';
			str += '<p>'+text+'</p></div>';
		$("#jqnotifications").append(str);
		$("#jqnotifications").css("overflow", "visible"); // IE = horrible
		$("#"+id).hide().fadeIn().delay(timeout).animate( { opacity: "0.01" }, "normal", function() {
			$(this).slideUp(function() {
				$(this).remove();
			});
		});
		
		// Notify the console :)
		// log | debug | info | warn | error
//		console.info(text);
	}

/*	// Currently broken fadein/out effects on mouseover
	$("#jqnotifications div").filter(function() {
		return ($this).closest("div").is("#jqnotifications");
	}).live("mouseover", function() {
		$(this).stop(true, true).animate( { opacity: "0.25" }, "fast");
	});

	$("#jqnotifications div").filter(function() {
		return ($this).closest("div").is("#jqnotifications");
	}).live("mouseover", function() {
		$(this).stop(true, true).animate( { opacity: "1" }, "fast");
	});
*/


