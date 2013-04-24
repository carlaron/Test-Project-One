<?php

//set menu for EOX public home (not in any client site)
	$menu_array = array(
		"Home" => "/",
		"Test" => "test",
		"Page Not Found" => "pagenotfound"
	);

//Actually make the menu
if(isset($menu_array)){
if(is_array($menu_array)){
	echo make_menu($menu_array);
} else {
	echo "No Menu Defined";
}
} else {
	echo "No Menu Defined";
}


/*********************************************************************************
 * Eportal Menu Functions
 * Handles generation of template-ready menu HTML from passed associative arrays.  
 */


/**
 * Determine if passed URL is current active page and return a classname to indicate active menu item
 * @param	$url (string)
 */
function is_current($url) {
	global $active_menu;
	$classname = ($active_menu == $url) ? 'current' : '' ;
	return $classname;
}


/**
 * Determine and return the final link target from a passed URL component
 * @param	$url (string)
 *
 * Possible URL formats:
 *	"url_one"             => "http://EPORTAL_DOMAIN_NAME/ACCOUNT_FOLDER/url_one",
 *	"/url_two"            => "http://EPORTAL_DOMAIN_NAME/url_two",
 *	"www.url_three.com"   => "http://www.url_three.com",
 *	"http://url_four.com" => "http://url_four.com"
 */
function return_url($url) {

	global $Account;

	// Is this a HTTP/HTTPS prefixed URL? It's probably good to go.
	if (substr($url, 0, 4) == 'http') {
		$link_url = $url;

	// Is this a www-prefixed URL? Throw an HTTP on it.
	} else if (substr($url, 0, 3) == 'www') {
		$link_url = 'http://'.$url;

	// Is this a root-level URL?
	} else if (substr($url, 0, 1) == '/') {
		$link_url = 'http://'.$_SERVER['HTTP_HOST'].$url;

	// It must just be an account-level URL
	} else {

		// Aha! gotta make sure there's actually an account, and you're not in the root
		if (empty($Account->folder)) {
			$link_url = 'http://'.$_SERVER['HTTP_HOST'].'/'.$url;
		} else {
			$link_url = 'http://'.$_SERVER['HTTP_HOST'].'/'.$Account->folder.'/'.$url;
		}
	}

	return $link_url;
}


/**
 * Create individual menu item
 * @param	$label (string)
 * @param	$url/$submenu (string OR array)
 */
function make_menu_item($label, $url) {

	global $Account, $active_menu;

	// Get ID tag
	$id_tag = strtolower(preg_replace("/[^A-Za-z0-9 ]/", '', $label));
	$id_tag = 'menu_'.str_replace(' ', '_', $id_tag);
	$menu_item = '';

	// Multi-level menu item (submenu)
	if (is_array($url)) {

		$this_url = (isset($url['TopLink'])) ? $url['TopLink'] : $active_menu ;
		$current_tag = is_current($this_url);
		$link_url = return_url($this_url);

		// Generate top-level link and loop through submenu to create HTML
		$menu_item = '<li id="'.$id_tag.'" class="'.$current_tag.'"><a href="'.$link_url.'">'.$label."</a>\n<ul>\n";
		foreach ($url as $sub_label => $sub_url) {
			$menu_item .= make_menu_item($sub_label,$sub_url);
		}
		$menu_item .= "</ul>\n</li>\n";

	// Single-level menu item
	} else {

		$current_tag = is_current($url);
		$link_url = return_url($url);

		// Don't create an item for any TopLink entries
		if ($label != "TopLink") {
			$menu_item = '<li id="'.$id_tag.'" class="'.$current_tag.'"><a href="'.$link_url.'">'.$label."</a>\n";
		}

	}
	// Give it back.
	return $menu_item;
}


/**
 * Create and return HTML menu from array
 * @param	$menu_array (array)
 */
function make_menu($menu_array) {

	global $Account, $User, $active_menu;

	// Set $active menu if it's not already set by page
	if ($active_menu == '') {
		$script_array = explode('/',$_SERVER['REQUEST_URI']);
		$active_menu = $script_array[count($script_array)-1];
	}

	// Cycle through menu array and make menu HTML
	$menu_html = '<ul class="menu" id="menu_ul">'."\n";
	foreach ($menu_array as $label => $url) {
		$menu_html .= make_menu_item($label,$url);
	}
	$menu_html .= "</ul>\n";

	// Return generated HTML
	return $menu_html;

}

// end functions
