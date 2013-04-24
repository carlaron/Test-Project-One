@section('title')
{{$title}}
@stop

@section('content')
<div class="grid_12">{{$top_zone}}</div>
<div class="clear"></div>

<div class="grid_12">&nbsp;</div>
<div class="clear"></div>

<div class="grid_6">{{$middle_left_zone}}</div>
<div class="grid_6">{{$middle_right_zone}}</div>
<div class="clear"></div>

<div class="grid_12">&nbsp;</div>
<div class="clear"></div>

<div class="grid_12">{{$bottom_zone}}</div>
<div class="clear"></div>
@stop