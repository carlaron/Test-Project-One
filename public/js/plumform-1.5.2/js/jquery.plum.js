/*!
 * Plum v1.4: A library of tools for jQuery
 *
 * Copyright 2011 RoboCréatif, LLC
 * <http://robocreatif.com>
 *
 * Date: 17 November, 2011
 */
var plum=plum||{};(function(a){String.prototype.plum=Number.prototype.plum=a.fn.plum=function(e,c){var d=e.split("."),b;e=d[0];if(d.length>1){b=c;c=d[1]}return typeof plum[e]==="function"?plum[e].call(this,c,b):this};a.each(["html","append"],function(c,b){c=a.fn[b];a.fn[b]=function(){var d=c.apply(this,arguments);this.trigger("plum",[d]);return d}})}(jQuery));