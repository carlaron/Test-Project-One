/*!
 * plum.Form v1.5.2: Styling web forms
 *
 * Copyright 2011 RoboCréatif, LLC
 * <http://robocreatif.com>
 *
 * Date: 15 January, 2012
 */

(function ($) {

	$.expr[':'].plum = function (a) { return !!$(a).data('plum-form'); };

	plum.form = function (options, method) {

		var prototype = plum.form.prototype;

		if (typeof options === 'string') {
			return this.each(prototype.validate(method));
		}

		// Run plum.Form on each matched form or form element
		options = options || {};
		options.listen = typeof options.listen === 'undefined' ? true : options.listen;
		this.each(prototype.init(options));

		// Add the selector to the cache to listen for DOM changes
		if (this.selector && options.listen) {
			prototype.selectors[this.selector] = options;
			prototype.listen(this.selector);
		}

		return this;

	};
	plum.form.prototype = {

		/** Default options | @since 1.0 */
		options: {
			action: null,
			ajax: false,
			complete: function () { },
			classes: {
				active: 'active',
				arrow: 'select-arrow',
				button: 'button',
				checkbox: 'checkbox',
				checked: 'checked',
				closed: 'closed',
				color: 'color',
				container: 'select-container',
				date: 'date',
				datetime: 'datetime',
				disabled: 'disabled',
				file: 'file',
				filelist: 'filelist',
				focus: 'focus',
				email: 'email',
				error: 'error',
				hover: 'hover',
				info: 'info',
				input: 'input',
				invalid: 'invalid',
				label: 'label',
				loading: 'loading',
				mixed: 'mixed',
				month: 'month',
				multiple: 'multiple',
				number: 'number',
				open: 'open',
				optgroup: 'optgroup',
				option: 'option',
				password: 'password',
				progress: 'progress',
				radio: 'radio',
				range: 'range',
				remove: 'remove',
				reset: 'reset',
				submit: 'submit',
				success: 'success',
				text: 'text',
				textarea: 'textarea',
				select: 'select',
				search: 'search',
				selected: 'selected',
				single: 'single',
				tel: 'tel',
				url: 'url',
				value: 'select-value',
				waiting: 'waiting',
				week: 'week',
				wrapper: 'select-wrapper'
			},
			json: false,
			labels: false,
			reset: false,
			speed: 150,
			submit: function () { }
		},
		selectors: { },

		/** Checks for silly IE7 | @since 1.0 */
		isIE7: navigator.appVersion.indexOf('MSIE 7.') > -1,

		/**
		 * Initializes plum.Form on each form or elements within a form
		 *
		 * @since  1.4
		 */
		init: function (options) {
			var prototype = this;
			return function () {

				var elem = $(this),
				isForm = this.nodeName.toLowerCase() === 'form',
				fields = $(':input:not(:hidden,:plum)', this),
				form = elem;
				if (!isForm) {
					form = elem.closest('form');
					form = form.length ? form : elem.find('form');
					fields = elem.is(':input') ? elem : fields;
				}

				// Initialize a new wrapper for each matched element
				if (form.length) {
					if (!form.data('plum-form')) form.attr('novalidate', true).data('plum-form', $());
					form.data('plum-form-options', $.extend(true, {}, prototype.options, options));
					form.unbind('submit', prototype.submit).bind('submit', prototype.submit);
					form.unbind('reset', prototype.reset).bind('reset', prototype.reset);
					fields.each(prototype.wrap(options || {}));
				}

			};
		},

		/**
		 * Binds events to elements and their respective wrappers
		 *
		 * @since  1.5
		 */
		bind: function () {
			var c = this.options.classes,
			element = this.element,
			wrapper = this.wrapper,
			mouse;

			if (!/^(?:button|reset|submit|select-one|select-multiple)$/.test(this.type)) {
				wrapper.css({ width: parseInt(wrapper.css('width'), 10)
					-parseInt(wrapper.css('borderLeftWidth'), 10)
					-parseInt(wrapper.css('borderRightWidth'), 10)
				});
			}

			element
				.css({ width: wrapper.css('width') })
				.bind('focus blur', function (e) {
					wrapper[e.type === 'focus' ? 'addClass' : 'removeClass'](c.focus);
				});
			wrapper
				.bind({
					mousedown: function () { mouse = true; wrapper.addClass(c.active); },
					mouseup: function () { mouse = false; wrapper.removeClass(c.active); },
					mouseenter: function () { mouse && wrapper.addClass(c.active); },
					mouseleave: function () { wrapper.removeClass(c.active); }
				});
		},

		/**
		 * In-field labels for text and textarea fields
		 *
		 * @since  1.1
		 */
		label: function () {

			// Helper variables
			var builder = this,
			parent = this.wrapper.parent(),
			label = [],
			speed = this.options.speed,
			c = this.options.classes;

			// Select the label
			if (/(?:select-one|select-multiple|file|submit|button|reset|radio|checkbox)/.test(this.type)) return;
			if (this.element[0].id) label = $('label[for="' + this.element[0].id + '"]');
			if (!label.length && parent.is('label')) label = this.wrapper.parent();
			if (!label.length) return;

			// Create the label
			this.wrapper.append('<label class="' + c.label + '">' + label.text() + '</label>');
			if (parent.is('label')) label.after(this.wrapper).remove();
			else label.remove();
			label = this.wrapper.children('label');
			label.css({
				height: this.element.outerHeight(),
				left: parseInt(this.element.css('paddingLeft'), 10),
				position: 'absolute',
				right: parseInt(this.element.css('paddingRight'), 10),
				top: 0,
				overflow: 'hidden'
			});
			label.bind('mousedown', false);
			label.bind('click', function () { builder.element.trigger('focus'); });

			// Listen for focusing and typing in the field
			this.element.bind({
				focus: function () { label.animate({ opacity: 0.4 }, speed, 'linear'); },
				blur: function () { label[this.value ? 'hide' : 'show']().animate({ opacity: 1 }, speed, 'linear'); },
				keypress: function (event) {
					if (event.which > 0 && event.which !== 8 && event.which !== 13) {
						label[(this.value + String.fromCharCode(event.which)).length ? 'hide' : 'show']();
					}
				},
				keyup: function () {
					label[this.value.length ? 'hide' : 'show']();
				}
			});
			if (this.element[0].value) label.hide();

		},

		/**
		 * Listens for changes to the DOM that apply to the list of selectors
		 *
		 * @since  1.4
		 */
		listen: function (selector) {
			var prototype = this;
			$('body').bind('plum', function (event, html) {

				$(':input:not(:plum,:hidden)', html).each(function () {
					if ($(this).closest(selector).length) {
						prototype.init(prototype.selectors[selector]).call(this);
					}
				});

			});
		},

		/**
		 * Reset handler for forms
		 *
		 * @since 1.1
		 */
		reset: function (event) {

			var form = $(this);
			window.setTimeout(function () {
				form.data('plum-form').trigger('blur').each(function () {
					var builder = $(this).data('plum-form'), c = builder.options.classes;
					if (builder.reset) {
						builder.reset();
					}
					builder.wrapper.removeClass(c.invalid);
					builder.wrapper.children('div.' + c.info).removeClass(c.success + ' ' + c.error);
				});
			}, 1);

		},

		/**
		 * Submit handler for forms
		 *
		 * @since  1.0
		 */
		submit: function (event) {

			// Helper variables
			var form = $(this),
			fields = form.data('plum-form'),
			options = $(this).data('plum-form-options'),
			c = options.classes,
			files,
			ajax;

			// Check for invalid fields and the return value of the "submit" option function
			if (
				fields.trigger('blur').filter(function () { return $(this).parent().hasClass(c.invalid); }).length
				|| options.submit.call(form[0]) === false
			) {
				return false;
			}

			if (options.ajax) {
				files = fields.filter(':file');
				// File uploads via a hidden iframe for older browsers
				if (files.length && !$.support.filexhr) {
					form.attr('target', 'plum-form');

				// File uploads for type-A browsers, or older browsers with no files to be uploaded
				} else {
					event.preventDefault();
					ajax = function () {
						$.ajax({
							url: form[0].action,
							data: form.serialize(),
							dataType: options.json ? json : '',
							type: form[0].method || 'POST',
							success: function (result) {
								options.reset && form.trigger('reset');
								options.complete.call(form[0], result);
							}
						});
					};
					if (files.length) {
						files.eq(0).data('plum-form').upload(ajax);
					} else {
						ajax();
					}
				}
			}

		},

		/**
		 * Creates a wrapper for each element based on the type of element, using
		 * classes and CSS styles
		 *
		 * @since  1.5
		 */
		wrap: function (options) {
			var prototype = this;
			return function () {

				// Plum has already been applied, exit the script
				if (this.parentNode.className.match(/plum-form/)) return;

				// Helper variables
				var c = {},
				elem  = $(this),
				form  = elem.closest('form'),
				node  = this.nodeName.toLowerCase(),
				type  = (this.getAttribute('type') || this.type || this.nodeName).toLowerCase(),
				display  = elem.css('display'),
				position = elem.css('position'),

				// Create the element's builder class
				builder  = new (typeof plum.form[type] === 'function' ? plum.form[type]
					: typeof plum.form[node] === 'function' ? plum.form[node]
					: typeof plum.form.input === 'function' ? plum.form.input
					: function () {});
				builder.options = $.extend(true, {}, prototype.options, builder.options, options);;
				c = builder.options.classes;
				builder.type = type;
				builder.element = elem.data('plum-form', builder);
				builder.wrapper = elem.wrap($('<div>', {
					title: this.title,
					dir: this.dir,
					'class': 'plum-form ' + (c[type] || '') + ' ' + (c[node] || '') + ' ' + (this.disabled && c.disabled || ''),
					css: {
						display: display === 'inline' && !prototype.isIE7 ? 'inline-block' : display,
						position: position === 'static' ? 'relative' : position,
						'float': elem.css('float'),
						width: /(?:checkbox|radio|button|submit|reset)/.test(type) ? '' : this.offsetWidth
					}
				})).parent();

				// Add the current element to the collection of elements in the form
				form.data('plum-form', form.data('plum-form').add(builder.element));

				// Bind listeners to the element and its wrapper
				prototype.bind.call(builder);
				builder.init && builder.init();
				builder.options.labels && prototype.label.call(builder);

				// IE7 needs to leave this world...
				if (prototype.isIE7 && !/(?:button|submit|reset)/.test(type)) {
					builder.element.css({
						width: builder.element.width() - (builder.element.outerWidth() - builder.wrapper.outerWidth())
							- parseInt(builder.element.css('borderLeftWidth'), 10)
							- parseInt(builder.element.css('borderRightWidth'), 10)
					});
				}

			};
		},

		/**
		 * Field validation
		 *
		 * @since  1.2
		 * @param  mixed  options  The type of validation to perform
		 */
		validate: function (options) {

			var prototype = this,
			c = this.options.classes,
			methods = {
				email: /^(?:"[\w!#$%&'\*+\.\-\/=?\^_`{|}~]+"|[\w!#$%&'\*+\.\-\/=?\^_`{|}~]+)@(?:\w(?:\-?[\w]+)?\.)*?\w+(?:\.[a-z]{2})?\.[a-z]{2,6}$/,
				tel: /^(?:(?:\+?1\s*(?:[\.\-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[\.\-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[\.\-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
				url: /^(?:https?:\/\/)?(?:[\w](?:\-?[\w]+)?\.)*?[\w]+(?:\.[a-z]{2})?\.[a-z]{2,4}(\/.+)?$/
			};

			return function () {

				var builder = $(this).data('plum-form'), info;
				if (!builder) return;

				info = $('<div class="' + c.info + '">').insertAfter(this);
				builder.element.bind('blur', function () {
					var valid = true;
					switch (typeof options) {
						case 'string':
							valid = this.value === options;
							break;
						case 'function':
							valid = !!options.call(this);
							break;
						default:
							'min' in options && (valid = valid && this.value.length >= options.min);
							'max' in options && (valid = valid && this.value.length <= options.max);
							'method' in options && (valid = 'min' in options && !options.min && !this.value ? true
								: valid && methods[options.method].test(this.value));
							break;
					}
					builder.wrapper[valid ? 'removeClass' : 'addClass'](c.invalid);
					info.removeClass(valid ? c.error : c.success).addClass(valid ? c.success : c.error);
				});

			};

		}

	};

}(jQuery));

/*! checkboxes | @since 1.0 */
(function ($) {

	plum.form.checkbox = function () { };
	plum.form.checkbox.prototype = {

		init: function () {

			var prototype = this,
			c = this.options.classes,
			wrap = this.wrapper,
			form = this.element.closest('form'),
			elem = this.element.bind('click', function () {
				var boxes, group = elem.attr('class');
				group = group ? group.match(/check-all-([^\s]+)/) : '';
				group = group ? group[1] : '';
				if (!group) {
					wrap.toggleClass(c.checked);
					prototype.checkall(this.name);
				} else {
					form.data('plum-form').filter(function () {
						return this.type === 'checkbox'
							&& !this.disabled
							&& (this.name === group || $(this).hasClass('check-all-' + group));
					}).each(function () {
						var wrap = $(this).parent();
						if (elem[0].checked || wrap.hasClass(c.mixed)) {
							this.checked = true;
							wrap.removeClass(c.mixed).addClass(c.checked);
						} else {
							this.checked = false;
							wrap.removeClass(c.checked + ' ' + c.mixed);
						}
					});
				}
			}).css({
				left: '50%',
				marginLeft: -this.element[0].offsetWidth / 2,
				marginTop: -this.element[0].offsetHeight / 2,
				opacity: 0,
				position: 'absolute',
				top: '50%'
			});
			wrap.css({ verticalAlign: '' });
			elem[0].checked && wrap.addClass(c.checked);
			prototype.checkall();

		},

		/** Check all or some boxes in a group | @since 1.0 */
		checkall: function (group) {

			var c = this.options.classes,
			form = this.element.closest('form');

			form.data('plum-form').filter(function () {
				return this.type === 'checkbox'
					&& !this.disabled
					&& /check-all-([^\s]+)/.test(this.className)
					&& (!group || $(this).hasClass('check-all-' + group));
			}).each(function () {
				var elem = $(this),
				wrap  = elem.parent(),
				group = this.className.match(/check-all-([^\s]+)/)[1],
				boxes = form.data('plum-form').filter(function () {
					return this.type === 'checkbox'
						&& !this.disabled
						&& this.name === group
						&& !/check-all-([^\s]+)/.test(this.className);
				}),
				checked = boxes.filter(':checked');
				if (checked.length === 0) {
					this.checked = false;
					wrap.removeClass(c.checked + ' ' + c.mixed);
				} else {
					this.checked = true;
					if (checked.length === boxes.length) {
						wrap.removeClass(c.mixed).addClass(c.checked);
					} else {
						wrap.addClass(c.checked + ' ' + c.mixed);
					}
				}
			});

		},

		/** Reset handler | @since 1.1 */
		reset: function () {

			this.wrapper[this.element[0].checked ? 'addClass' : 'removeClass'](this.options.classes.checked);
			this.checkall();

		}

	};

}(jQuery));

/*! file uploads | @since 1.0 */
(function ($) {

	plum.form.file = function () { };
	plum.form.file.prototype = {

		/** Default options | @since 1.5 */
		options: {
			file: {
				autoupload: false,
				button: 'Choose a file...',
				complete: function () { },
				errorsize: 'Please choose a file smaller than {filesize}.',
				errortype: 'Allowed file types: {filetype}.',
				files: 0,
				html: '<span class="filename">{filename}</span>'
					+ '<span class="remove">&times;</span>'
					+ '<span class="filesize">{filesize}</span>'
					+ '<div class="progress"><div></div></div>',
				progress: function (e) {
					e.progressbar.children().stop(true, true)
						.animate({ width: e.percent + '%' }, 150);
				},
				size: 0,
				start: function () { },
				types: []
			}
		},

		/** Initialize plum.Form | @since 1.5 */
		init: function () {

			// Helper variables
			var c  = this.options.classes,
			f = this.options.file,
			elem = this.element,
			wrap = this.wrapper,
			form = elem.closest('form'),
			fileQueue = form.data('plum-form-upload') || $(),
			button,
			mouse;

			form.data('plum-form-upload', fileQueue.add(elem));

			// Check for AJAX upload support
			this.support();

			// Create a faux-button to trigger opening the file dialogue window
			elem.data('plum-form-queue', []);
			elem.data('plum-form-index', 0);
			elem.attr('multiple', true).addClass('plum-form-0');
			elem.attr('tabindex', -1);
			elem.css({ opacity: 0, position: 'absolute', width: 50 });
			elem.before(this.create('button'));
			wrap.children().wrapAll(this.create('wrapper'));
			wrap.append(this.create('list'));
			button = $(':button', wrap).parent();

			// Bind events to the element
			elem.bind('change', this.change);
			elem.bind('mousedown', function () { mouse = true; wrap.addClass(c.active); });
			elem.bind('mouseup', function () { mouse = false; wrap.removeClass(c.active); });
			elem.bind('focus', function () { wrap.removeClass(c.focus); button.addClass(c.focus); });
			elem.bind('blur', function () { wrap.removeClass(c.focus); button.removeClass(c.focus); });

			// Bind events to the element wrapper
			button.bind('mouseover', function () { button.addClass(c.hover); mouse && button.addClass(c.active); });
			button.bind('mouseout', function () { button.removeClass(c.hover + ' ' + c.active); });
			button.bind('mousemove', function (event) {
				var file = $(':file', this).eq(-1);
				file.css({
					left: -file.outerWidth(),
					marginLeft: event.pageX - button.offset().left + 25,
					top: event.pageY - button.offset().top - 10
				});
			});

		},

		/**
		 * Adds a file to the file list
		 *
		 * @since  1.0
		 * @param  object  properties  An object containing a file's name, size,
		 *                             type and any applicable errors
		 */
		add: function (properties) {

			var queue = this.element.data('plum-form-queue'),
			speed = this.options.speed,
			c  = this.options.classes,
			li = this.wrapper.find('ul').append(this.create('item', properties)).children(':last-child').fadeIn(speed);

			// When clicking on a "remove" button in the file list, that file is
			// removed from the upload queue.
			$('.' + c.remove, li).bind('click', function () {
				var i = li[0].className.match(/(?:(?:.+\s+)?)?plum-upload-([\d]+)/)[1],
				file = $(':file.plum-upload-' + i);
				li.fadeOut(speed, function () { li.remove(); });
				typeof queue[i] !== 'undefined' && queue.splice(i, 1);
				!$.support.file && file.remove();
			});

			// If an error occurred, or if the browser doesn't support uploading
			// files via AJAX, remove the progress bar. Otherwise, make sure the
			// progress bar (if one exists) is empty.
			if (properties.error || !$.support.filexhr) {
				$('.' + c.progress, li).remove();
			} else {
				$('.' + c.progress, li).children().css({ width: 0 });
			}

		},

		/** Listens for changes | @since 1.5 */
		change: function () {

			var elem = $(this),
			builder = elem.data('plum-form'),
			queue = elem.data('plum-form-queue'),
			index = elem.data('plum-form-index'),
			options = builder.options,
			properties = { name: this.value, size: '', type: '', error: '' },
			i = 0, l, c = options.classes, f = options.file, file;

			// Good for you, you're using an awesome browser
			if ($.support.file) {
				// If AJAX is not enabled, the queue must be reset when the file
				// field is updated.
				if (!options.ajax && !f.autoupload) {
					queue = [];
					builder.wrapper.find('ul').empty();
				}
				for (l = this.files.length; i < l; i++) {

					// There are too many files in the queue
					if (f.files && builder.queue.length === f.files) break;

					// Set the file properties
					file = this.files[i];
					properties.name = file.name || file.fileName;
					properties.size = file.size || file.fileSize;
					properties.type = file.type || file.fileType;
					properties.error = f.size && properties.size > f.size ? '<div>' + f.errorsize + '</div>'
						: f.types.length && $.inArray(properties.type, f.types) < 0 ? '<div>' + f.errortype + '</div>'
						: '';

					// If no errors occured, the file can be added to the queue
					if (!properties.error) {
						index++;
						queue.push(file);
					}
					builder.add(properties);

				}
				f.autoupload && builder.upload();

			// Using a stupid browser and attempting to add files to the queue.
			// No informational errors can be displayed.
			} else if (f.files && builder.queue.length <= f.files) {
				properties.name = properties.name.substring(properties.name.lastIndexOf('\\') + 1);
				index++;
				queue.push(this.value);
				builder.add(properties);

				// This type of browser doesn't support multiple file uploads,
				// so we can immitate the effect by adding multiple fields.
				// It forces a user to add files one at a time, but sacrifices
				// must be made.
				elem.css({ zIndex: -998 });
				elem.unbind('change', builder.change);
				elem.after(elem.clone().val(''));
				elem = elem.next();
				elem.data('plum-form', builder);
				elem.removeClass('plum-upload-' + (index - 1));
				elem.addClass('plum-upload-' + index);
				elem.css({ zIndex: 998 });
				elem.bind('change', builder.change);

			}

			elem.data('plum-form-queue', queue);
			elem.data('plum-form-index', index);

		},

		/**
		 * Creates additional elements
		 *
		 * @since   1.5
		 * @param   string  create      The type of field to create
		 * @param   object  properties  Optional property list
		 * @return  object  Returns a jQuery object containing the element
		 */
		create: function (create, properties) {

			var c = this.options.classes, f = this.options.file;
			switch (create) {

				// Create a button
				case 'button':
					var title = this.wrapper[0].title;
					this.wrapper[0].title = '';
					this.element[0].title = '';
					return $('<button type="button">' + (title || f.button) + '</button>');

				// Create an item in the file list
				case 'item':
					return $('<li>', {
						'class': (properties.error ? c.error : c.waiting)
							+ ' plum-upload-' + this.element.data('plum-form-index'),
						css: { display: 'none' },
						html: f.html
								.replace(/\{filename\}/g, properties.name)
								.replace(/\{filesize\}/g, this.size(properties.size))
								.replace(/\{filetype\}/g, properties.type)
							+ properties.error
								.replace(/\{filesize\}/g, this.size(f.size))
								.replace(/\{filetype\}/g, f.types.join(', '))
							+ '<div style="clear:both"></div>'
					});

				// Create the file list
				case 'list':
					return $('<ul>', { 'class': c.filelist });

				// Create the button wrapper
				case 'wrapper':
					return $('<div>', {
						'class': 'plum-form ' + c.input + ' ' + c.button,
						css: {
							display: 'inline-block',
							overflow: 'hidden',
							position: 'relative',
							verticalAlign: 'top',
							width: plum.form.prototype.isIE7 ? 'auto' : '',
							zoom: plum.form.prototype.isIE7 ? 1 : ''
						}
					});

				default:
					break;

			}

		},

		/**
		 * Creates a more visibly-friendly size (bytes, Kb, Mb, Gb)
		 *
		 * @since   1.1
		 * @param   int     size  The size, in bytes
		 * @return  string  A formatted string of the original size
		 */
		size: function (size) {

			size   = { B: size };
			size.K = size.B / 1024;
			size.M = size.K / 1024;
			size.G = size.M / 1024;
			return size.G > 1 ? Math.round(size.G) + ' GB'
				: size.M > 1 ? Math.round(size.M) + ' MB'
				: size.K > 1 ? Math.round(size.K) + ' KB'
				: size.B > 0 ? size.B + ' bytes'
				: '';

		},

		/**
		 * Checks for browser AJAX file support
		 *
		 * In order to support "AJAX" file uploads, unsupporting browsers must
		 * submit forms to post in a hidden iframe. While it's not true AJAX,
		 * it allows old browsers to attempt to keep up with modern, standards-
		 * compliant browsers.
		 *
		 * Note: Prior to 1.5, this ran as soon as Plum was initiated. In 1.5
		 * and later, this is run only if a file field exists on the page, and
		 * if options require the file to be submitted via AJAX.
		 *
		 * @since  1.5
		 */
		support: function () {

			$.support.file = window.File && window.FileList;
			$.support.filexhr = window.XMLHttpRequestUpload;
			if (!$.support.filexhr && !$('iframe[name="plum-form"]').length) {
				$('<iframe name="plum-form">').attr('src', 'about:blank').css({
					border: 0,
					left: '-9999em',
					height: 0,
					position: 'absolute',
					top: '-9999em',
					width: 0
				}).appendTo('body');
			}

		},

		/** Reset handler | @since 1.1 */
		reset: function () {

			this.element.data('plum-form-queue', []);
			this.element.data('plum-form-index', 0);
			this.wrapper.find(':file:gt(0)').remove();
			this.wrapper.find('li').fadeOut(this.options.speed, 'linear', function () {
				$(this).remove();
			});

		},

		/** Uploads files to the server | @since 1.1 */
		upload: function (callback) {

			var builder = this,
			elem = this.element,
			form = elem.closest('form'),
			fileQueue = form.data('plum-form-upload'),
			queue = elem.data('plum-form-queue');

			// Exit if no files can be uploaded
			if (!queue.length) {
				fileQueue = fileQueue.slice(1);
				form.data('plum-form-upload', fileQueue);
				return !fileQueue.length ? (callback ? callback() : function () {})
					: fileQueue.eq(0).data('plum-form').upload(callback);
			}

			// Helper variables
			var options = this.options,
			c = options.classes,
			li = this.wrapper.find('li:eq(0)'),
			file = queue.shift(),
			progressbar = $('.' + c.progress, li).slideDown(options.speed),
			xhr;

			xhr = new XMLHttpRequest;

			// Begin uploading
			xhr.upload.addEventListener('loadstart', function (event) {
				li.toggleClass(c.waiting + ' ' + c.loading);
				options.file.start.call(li, $.extend(event, {
					progressbar: progressbar,
					percent: event.loaded / event.total * 100
				}));
			}, false);

			// File is uploading
			xhr.upload.addEventListener('progress', function (event) {
				options.file.progress.call(li, $.extend(event, {
					progressbar: progressbar,
					percent: event.loaded / event.total * 100
				}));
			}, false);

			// File has finished uploading
			xhr.onreadystatechange = function (event) {
				if (xhr.readyState === 4) {
					options.file.complete.call(li, $.extend(event, {
						progressbar: progressbar,
						percent: 100
					}), options.json ? $.parseJSON(xhr.responseText) : xhr.responseText);
					li.fadeOut(options.speed, function () {
						li.remove();
						builder.upload(callback);
					});
				}
			};

			xhr.open('POST', form[0].action, true);
			xhr.setRequestHeader('Content-Type', file.type);
			xhr.setRequestHeader('X-File-Name', file.name);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.send(file);

		}

	};

}(jQuery));

/*! unmatched form elements | @since 1.0 */
(function ($) {

	plum.form.input = function () { };
	plum.form.input.prototype = {

		init: function () {

			var c = this.options.classes, elem = this.element;
			switch (this.type) {
				case 'textarea':
					elem.css({ resize: 'none', verticalAlign: 'bottom' });
					break;
				case 'button':
				case 'submit':
				case 'reset':
					elem.attr('formnovalidate', true);
					break;
				default:
					elem.css({ verticalAlign: 'bottom' });
					this.wrapper.addClass(c.text);
					break;
			}

		}

	};

}(jQuery));

/*! radio buttons | @since 1.0 */
(function ($) {

	plum.form.radio = function () { };
	plum.form.radio.prototype = {

		init: function () {

			var c = this.options.classes,
			wrap  = this.wrapper,
			form  = this.element.closest('form'),
			elem  = this.element.bind('click', function () {
				form.data('plum-form').filter(function () {
					return this.type === 'radio' && this.name === elem[0].name;
				}).each(function () {
					$(this).parent().removeClass(c.checked);
				});
				wrap.addClass(c.checked);
			}).css({
				left: '50%',
				marginLeft: -this.element[0].offsetWidth / 2,
				marginTop: -this.element[0].offsetHeight / 2,
				opacity: 0,
				position: 'absolute',
				top: '50%'
			});
			wrap.css({ verticalAlign: '' });
			elem[0].checked && wrap.addClass(c.checked);

		},

		/** Reset handler | @since 1.1 */
		reset: function () {

			this.wrapper[this.element[0].checked ? 'addClass' : 'removeClass'](this.options.classes.checked);

		}

	};

}(jQuery));

/*! select menus | @since 1.0 */
(function ($) {

	plum.form.select = function () {};
	plum.form.select.prototype = {

		list: '',
		string: '',
		innerwrapper: null,
		container: null,
		valuecontainer: null,
		selected: null,
		menuoptions: null,
		original: [],
		values: [],
		end: 0,
		index: 0,
		height: 0,
		liHeight: 0,
		maxHeight: 0,
		multiple: false,
		isopen: false,

		init: function () {

			var elem = this.element[0], c = this.options.classes, builder = this;
			this.wrapper.addClass(elem.multiple ? c.multiple + ' ' + c.open : c.single + ' ' + c.closed);

			// Private variables
			this.multiple
				= elem.multiple;
			this.innerwrapper
				= this.wrapper.prepend(this.create('inner')).children('div');
			this.valuecontainer
				= this.innerwrapper.append(this.create('value')).children('div');
			this.selected
				= this.valuecontainer.html(this.create('arrow')).children('div:first-child');
			this.container
				= this.innerwrapper.append(this.create('menu', { width: elem.offsetWidth })).children('ul');

			this.wrapper.bind('mousedown', false);
			this.element.bind('rebuild', this.rebuild);
			this.element.bind('change', this.close);
			this.element.bind('keydown', { builder: this }, this.keydown);
			this.element.bind('keypress', { builder: this }, this.keypress);
			this.element.trigger('rebuild');

			this.element.css({
				opacity: 0,
				position: 'absolute',
				top: 0,
				zIndex: -999
			});

			// Select-multiple menus can stop processing here
			if (elem.multiple) return;

			/**
			 * For select-one menus, the menu wrapper needs to have an absolute position
			 * to allow for overflow. When the document is clicked, Plum should determine
			 * whether the menu needs to be opened or closed by checking for an existing
			 * class in the wrapper. Clicks on disabled menus, disabled options and option
			 * groups can of course be ignored.
			 */
			this.container.css({ position: 'absolute' });
			$(document).bind('click', function (event) {

				event = $(event.target);
				var c = builder.options.classes;

				if (event.closest('div.plum-form.' + c.select)[0] !== builder.wrapper[0]) {
					builder.isopen && builder.close();
					return this;
				}
				if (elem.disabled || event.hasClass(c.disabled) || event.is('label') || event.is('li')) {
					return this;
				}
				builder[builder.isopen ? 'close' : 'open']();

			});

		},

		/**
		 * Creates elements for the menu
		 *
		 * @since   1.5
		 * @param   string  create      The type of field to create
		 * @param   object  properties  Optional property list
		 * @return  object  Returns a jQuery object containing the element
		 */
		create: function (create, properties) {

			var c = this.options.classes;
			return function () {
				switch (create) {
					case 'arrow':
						return $('<div></div><div class="' + c.arrow + '"></div>');
					case 'inner':
						return $('<div class="' + c.wrapper + '">');
					case 'menu':
						return $('<ul class="' + c.container + '">').css({
							overflowX: 'hidden',
							overflowY: 'scroll',
							position: 'relative',
							whiteSpace: 'nowrap',
							width: properties.width
						});
					case 'value':
						return $('<div class="' + c.value + '">').css({
							position: 'relative',
							verticalAlign: 'bottom'
						});
				}
			};

		},

		/**
		 * Listening for clicks on options in the menu.
		 *
		 * @since  1.1
		 * @param  object  e  "click" event object
		 */
		click: function (event, preventChange) {

			var builder = event.data.builder,
			c = builder.options.classes;
			index = builder.menuoptions.index(this),
			option = builder.original[index],
			pos = 0,
			start = 0,
			end = 0;

			// Holding down the CTRL/command key on a select-multiple menu
			if (event.metaKey && builder.multiple) {
				$(this).toggleClass(c.selected);
				option.selected = !option.selected;
				builder.index = index;

			// Holding down the shift key on a select-multiple menu
			} else if (event.shiftKey && builder.multiple) {
				start = index < builder.index ? index : builder.index;
				end = index < builder.index ? builder.index : index;
				$.each(builder.original, function () { this.selected = false; });
				builder.menuoptions.removeClass(c.selected);
				for (; start <= end;) {
					builder.original[start].selected = true;
					builder.menuoptions.eq(start++).addClass(c.selected);
				}

			// Normal clicking on all menu types
			} else {
				$(this).addClass(c.selected);
				option.selected = true;
				builder.end = index;
				builder.index = index;
				builder.menuoptions.not(this).removeClass(c.selected);
				!builder.multiple && builder.selected.text(builder.values[index]);

			}
			pos = builder.liHeight * builder.index;
			if (pos < builder.container.scrollTop()) {
				builder.container.scrollTop(pos);
			} else if (pos > builder.height - builder.liHeight) {
				builder.container.scrollTop(pos - builder.height + builder.liHeight);
			}
			!preventChange && builder.element.trigger('change');

		},

		/** Closes a menu when an option is clicked or menu defocused | @since 1.1 */
		close: function () {

			var builder = this.wrapper ? this : $(this).data('plum-form'),
			c = builder.options.classes;

			if (this.multiple || !builder.isopen) return;

			// Close the menu
			builder.wrapper.css({ zIndex: 998 });
			builder.container.slideUp(builder.options.speed, 'linear', function () {
				builder.element.trigger('close');
				builder.wrapper.css({ zIndex: '' }).toggleClass(c.open + ' ' + c.closed);
				builder.isopen = false;
			});

		},

		/**
		 * Applicable only to select-one menus, a menu is opened when the selected
		 * value text or the arrow is clicked.
		 *
		 * To prevent the menu from doing stupid things to the document's global
		 * height, the top margin of the menu container should be calculated to
		 * keep the top and bottom of the menu at least 25 pixels from the top and
		 * bottom of the document. Opened menus are given a z-index of 9999.
		 *
		 * @since  1.1
		 */
		open: function () {

			var builder = this,
			c = this.options.classes,
			speed = this.options.speed,
			docHeight = $(document).height(),
			offsetTop = this.wrapper.offset().top,
			marginTop = -this.valuecontainer.outerHeight(true)
				- parseInt(this.wrapper.css('borderTopWidth'), 10);

			// Prevent the menu from going below 50 pixels from the document's base
			if (offsetTop + this.height + 50 > docHeight) {
				marginTop = docHeight - offsetTop - this.height - 50;
			}

			// Prevent the menu from going above 25 pixels from the document's top
			if (marginTop * -1 > offsetTop + 25) {
				marginTop = -offsetTop + 25;
			}

			// Open the menu
			this.isopen = true;
			this.element.trigger('focus').trigger('open');
			this.wrapper.css({ zIndex: 999 }).toggleClass(c.open + ' ' + c.closed);
			this.container.stop(true, true).animate({ marginTop: marginTop }, speed, 'linear');
			this.container.stop(true, true).slideDown(speed, 'linear', function () {
				builder.container.scrollTop(builder.liHeight * builder.index);
			});

		},

		/**
		 * Handles keydown events on a menu (select-one and -mutiple).
		 *
		 * @since  1.1
		 * @param  object  event  "keydown" event object
		 */
		keydown: function (event) {

			var builder = event.data.builder,
			c = builder.options.classes,
			index = 0;console.log(event.which);

			switch (event.which) {
				case 8: // BACKSPACE
					builder.string = builder.string.substring(0, builder.string.length - 1);
					event.preventDefault();
					break;
				case 13: // ENTER
					builder.element.trigger('change');
					break;
				case 9: // TAB
				case 27: // ESC
					builder.close();
					break;
				case 38: // UP
				case 40: // DOWN
					if (!event.ctrlKey) {
						builder.end = event.which === 38
							? builder.end - 1 >= 0 ? builder.end - 1 : 0
							: builder.end + 1 < builder.original.length ? builder.end + 1 : builder.original.length - 1;
						if (builder.end !== builder.index) {
							builder.click.call(builder.menuoptions.eq(builder.end)[0], event, true);
						}
						event.preventDefault();
					}
					break;
				default:
					break;
			}

		},

		/**
		 * Keyboard handler for the enter key when focused on a menu option.
		 *
		 * @since  1.1
		 * @param  object  event  "keypress" event object
		 */
		keypress: function (event) {

			var builder = event.data.builder,
			c = builder.options.classes,
			index = 0;

			if (event.which !== 13 && event.which !== 8) {
				builder.string += String.fromCharCode(event.which);
				index = builder.search(builder.string);
				if (index > -1) {
					builder.click.call(builder.menuoptions.eq(index)[0], event);
				}
			}

		},

		/**
		 * Filters the available text values in an option list to match that of
		 * the search string while type-selecting options.
		 *
		 * @since  1.1
		 * @param  string  string  The value to find in the option list
		 */
		search: function (string) {

			string = string.toLowerCase();
			for (var i = 0, l = this.values.length; i < l; i++) {
				if (this.values[i].toLowerCase().substring(0, string.length) === string) {
					return i;
				}
			}
			return -1;

		},

		/** Creates the list of options and option groups in a menu | @since 1.0 */
		optionlist: function () {

			// Helper variables
			var elem = $(this),
			builder = elem.closest('.plum-form').find('select').data('plum-form'),
			c = builder.options.classes,
			node = this.nodeName.toLowerCase(),
			text = this.label || this.textContent || this.innerText;

			builder.list += '<li class="' + c[node] + ' '
				+ (this.disabled && c.disabled || '') + ' '
				+ (this.selected && c.selected || '') + '">';

			// Sets the selected value and inner text if an option
			if (node === 'option') {
				builder.list += text;
				if (!this.disabled) {
					builder.original.push(this);
					builder.values.push(text);
				}

			// If an option group, creates the options in the group
			} else {
				builder.list += '<label>' + text + '</label><ul>';
				elem.children().each(builder.optionlist);
				builder.list += '</ul>';
			}

			builder.list += '</li>';

		},

		/** Rebuilds the menu | @since 1.4 */
		rebuild: function () {

			var elem = $(this),
			builder = elem.data('plum-form'),
			c = builder.options.classes;

			// Rebuild the menu
			builder.original = [];
			builder.values = [];
			builder.list = '';
			builder.element.children().each(builder.optionlist);
			builder.container.show().html(builder.list);
			builder.liHeight = $('li.' + c.option, builder.container).eq(0).outerHeight(true);
			builder.maxHeight = builder.liHeight * (this.size || (this.multiple ? 5 : 10));
			$.each(builder.original, function (i) {
				if (this.selected) {
					builder.index = i;
					builder.end = i;
					return false;
				}
			});

			// Set up the menu's CSS
			builder.container.css({
				display: this.multiple ? 'block' : 'none',
				maxHeight: builder.maxHeight
			});
			builder.height = builder.container.outerHeight(true);

			// Bind click events to each option
			builder.menuoptions = builder.container
				.find('li.' + c.option + ':not(.' + c.disabled + ')')
				.bind('click', { builder: builder }, builder.click);

			// Fix the wrapper's width
			builder.wrapper
				[this.disabled ? 'addClass' : 'removeClass'](c.disabled)
				.css({ width: builder.container.outerWidth(true) });

			// Apply the selected value text
			!this.multiple && builder.selected.text(
				elem.find('option[selected]').filter(':last').text() ||
				elem.find('option:eq(0)').text()
			);

		},

		/** Reset handler | @since 1.1 */
		reset: function () {

			var builder = this, value = this.element.val(), c = this.options.classes;
			this.end = 0;
			this.menuoptions.removeClass(c.selected);
			if (typeof value === 'object') {
				$.each(value, function (k, v) {
					$.each(builder.original, function (i) {
						if (this.value === v) builder.menuoptions.eq(i).addClass(c.selected);
					});
				});
			} else {
				$.each(this.original, function (i) {
					if (this.value === value) builder.menuoptions.eq(i).addClass(c.selected);
				});
			}
			$.each(this.original, function (i) {
				if (this.selected) {
					builder.index = i;
					return false;
				}
			});

		}

	};

}(jQuery));