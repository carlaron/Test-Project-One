<?php

class Zone extends Eloquent {
	protected $table = 'zones';
	
	public function render(){
		return htmlentities($this->data);	
	}

}

