<?php

namespace accounts\shared;

use BaseController;

class CustompageController extends BaseController {

	public function index($params=array()){
		$account = $params['account'];
		$account_id = $account->acct_id;
		$account_folder = $account->acct_folder;
		$sub_uri = $params['sub_uri'];

		//make the rest of the URI into an array
		$sub_uri_array = explode("/", trim($sub_uri));
		
		//find page to show from URI array
		if($sub_uri_array[0] != ""){
			$page_menu_name = $sub_uri_array[0];
		} else {
			//return "FOO";
			\App::abort(404, "Page $page_menu_name not found. (/custom_page/$sub_uri)");
		}

		if(!$custom_page = \Page::where('page_menu_name',$page_menu_name)->first()){
			\App::abort(404, "Page $page_menu_name not found. (/custom_page/$sub_uri)");
		}
		$page_layout_json = $custom_page->page_layout_data;
		$page_layout_data = json_decode($page_layout_json);
		$sub_template = $page_layout_data->layout;
		$sub_template = str_replace(".html", "", $sub_template);
		$page_zones = $page_layout_data->zones;
		$params['title'] = $custom_page->page_title;
		foreach($page_zones as $zone_name => $zone_id){
			$zone_type = \Zone::find($zone_id)->type;
			if($zone_type == "HtmlModule"){
				$zone = \HtmlZone::find($zone_id);
			} else {
				$zone = \Zone::find($zone_id);
			}
			$zone_html = $zone->render();
			$params[$zone_name] = $zone_html;
		}
		
		$custom_layout = \View::make('accounts.'.$account_folder.'.page_tpl',$params);
		return $custom_layout->nest('content', 'accounts.'.$sub_template, $params);
		//return \View::make('accounts.'.$sub_template, $zone_params);
	}

}