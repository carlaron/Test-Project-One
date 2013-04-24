<?php

class HtmlZone extends Eloquent {
	protected $table = 'zones';

	function render() {	
		$data = json_decode($this->data);
		if(isset($data->title)){
			$title = $data->title;
		} else {
			$title = "Title";
		}
		$content= $data->content;
	
		return <<<TEMPLATE_HTML

<div class="ui-widget ui-widget-content ui-corner-all">
	<div class="ui-widget-header ui-corner-all ui-helper-clearfix pad_5">
		{$title}
	</div>
	<!--{end if}-->
	<div class="ui-dialog-content ui-widget-content pad_5">
		{$content}
	</div>
</div>

TEMPLATE_HTML;

	}

} // End HtmlZone
