// Plum doesn't touch elements that have already been styled, so to have
// in-field labels on some elements and no in-field label on a specific
// element, we need to apply Plum to that specific element first.
$('input[name="label-field-outside"]').plum('form');
$('form').plum('form', {
	ajax: true,
	labels: true,
	reset: true,
	file: {
		autoupload: true,
		size: 2097152,
		types: [ 'image/png', 'image/jpeg' ]
	}
});

// Validate telephone number
$('#tel').plum('form.verify', { method: 'tel' });

// Validate email address
$('#email').plum('form.verify', { method: 'email' });

// Validate URL
$('#url').plum('form.verify', { method: 'url' });

// Custom validation: the password fields must begin with 3 letters and
// end with 3 numbers and both fields must match
$('#password').plum('form.verify', function () {
	return /^[a-zA-Z]{3}[\d]{3}$/.test(this.value);
});
$('#password-retype').plum('form.verify', function () {
	var password = $('#password').val();
	return password && password === this.value;
});

// Adding form elements on the fly
// These are of course, only examples. You can load via AJAX entire pages
// that contain forms

// Add a select menu
$('#add-select').bind('click', function () {
	var size = $('select').length + 1;
	$('#ajax').append(
		'<select name="select-' + size + '">'
		+ '<option value="1">Option 1</option>'
		+ '<option value="2">Option 2</option>'
		+ '<option value="3">Option 3</option>'
		+ '</select><br>'
	);
});

// Add a checkbox to group 1
$('#add-checkbox').bind('click', function () {
	var size = $('input[name="group1[]"]').length + 1;
	$('#ajax').append(
		'<label><input type="checkbox" name="group1[]" value="group1-box-'
		+ size + '"> Group 1, box ' + size + '</label><br>'
	);
});

// Color switcher for demo
$('a').bind('click', function () {
	if (this.href.indexOf('#') > -1) {
		var color = this.href.substring(this.href.lastIndexOf('#') + 1);
		$('#dark-color').attr('href', 'skins/dark/dark-' + color + '.css');
	}
});

// Example cascading menu
$('#camera-make').bind('change', function () {
	// We need to determine what models are associated with what manufacturer.
	switch (this.value) {
		case 'Canon':
			var options = ['60D ($1,170)', '7D ($1,700)'];
			break;
		case 'Nikon':
			var options = ['D90 ($1,200)', 'D7000 ($1,500)'];
			break;
		case 'Pentax':
			var options = ['K-5 ($1,600)'];
			break;
		default:
			var options = [];
			break;
	}
	// Next, we add the "Select a model" option to the front of the list
	options.unshift('Select a model');
	$('#camera-model')
		.attr('disabled', !(options.length > 1))
		// Add the options to the "camera-model" menu
		.html('<option>' + options.join('</option><option>') + '</option>')
		// Finally, tell Plum to rebuild the menu
		.trigger('rebuild');
});

// Example resizing on open/close
var open_close_width;
$('#open-close').bind({
	open: function () {
		// We need the width of the outer wrapper so we know what to go back
		// to after the menu is closed.
		var wrapper = $(this).parent();
		open_close_width = wrapper.width();
		// Then change the width of the wrapper and the options container
		$('ul.select-container', wrapper).add(wrapper)
			.animate({ width: 300 }, 150);
	},
	close: function () {
		var wrapper = $(this).parent();
		// Now we need to adjust the containers back to their original widths
		$('ul.select-container', wrapper).add(wrapper)
			.animate({ width: open_close_width }, 150);
	}
});