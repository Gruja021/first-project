app.directive('onEnter', function(){
	function linkFunction(scope, elem, attrs){

		elem.keypress(function(e) {
		    if(e.which == 13) {
		    	if(e.target.nodeName == "INPUT"){
					var enter = $("[data-enter='" + attrs.onEnter + "']");
		    		enter.click();
				} 	
		    }
		});
	}

	return {
		link: linkFunction,
		restrict: 'EA',
		scope: false
	};
});