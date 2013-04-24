<?php
// This probably should become a Class, but not sure where to best do that in Laravel.
// It works pretty well right here in the menu View, though.
// Required that the $account object be passed into the view

//get Account's menu JSON
$menu_json = $account->acct_menu_json;
//Make that into an array, which the functions like.
$menu_array = json_decode($menu_json,true);
//Get the Account's home folder name
//not sure why this needs to be declared global here, instead of in functions below... WTF?
global $account_folder;
$account_folder = $account->acct_folder;

// Build the menu if we have a good array
if(!isset($menu_array)){
	die("No Menu Defined");
}
if(is_array($menu_array)){
	//use the functions below
	echo make_menu($menu_array);
} else {
	echo "No Menu Array Defined";
}


/*****************************************************************************************************
 * Eportal Menu Functions
 *
 * Handles generation of template-ready menu HTML from passed associative arrays.  
 * 
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
 *	"url_one"             => "http://EOX_DOMAIN_NAME/ACCOUNT_FOLDER/url_one", #local account site page in account folder
 *						OR		 => "http://ACCOUNT_CUSTOM_DOMAIN/url_one", #local account site page on custom domain
 *	"www.url_three.com"   => "http://www.url_three.com", # full URL, but they forgot http://
 *	"http://url_four.com" => "http://url_four.com" # real full URL
 */
function return_url($url) {

	global $account,$account_folder;

	// Is this a HTTP/HTTPS prefixed URL? It's probably good to go.
	if (substr($url, 0, 4) == 'http') {
		$link_url = $url;

	// Is this a www-prefixed URL? Throw an HTTP on it.
	} else if (substr($url, 0, 3) == 'www') {
		$link_url = 'http://'.$url;

	// Is this a slash prefixed URL? It is a link out to root EOX site for some weird reason
	} else if (substr($url, 0, 1) == '/') {
		$link_url = 'https://'.$_SERVER['HTTP_HOST'].$url;

	// It must just be an client-account-level URL
	} else {

		// is this in a user sub-folder, or a user domain alias
		// demo.HOSTNAME.COM or HOSTNAME.COM/demo
		// our htaccess uses a modrewrite with PROXY forwarding to handle custom user domains
		if(isset($_SERVER['HTTP_X_FORWARDED_HOST'])){
			$link_url = 'https://'.$_SERVER['HTTP_X_FORWARDED_HOST'].'/'.$url;
		} else {
			$link_url = 'https://'.$_SERVER['HTTP_HOST'].'/'.$account_folder.'/'.$url;
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

	global $account, $active_menu, $account_folder;

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

	global $account, $active_menu, $account_folder;
	
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