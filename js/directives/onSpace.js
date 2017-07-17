app.directive('onSpace', function(){
	function linkFunction(scope, elem, attrs){

		elem.keypress(function(e) {
		    if(e.which == 32) {
		    	if(e.target.nodeName == "TEXTAREA"){
		    		scope.$apply(function (){
	                    scope.$eval(attrs.onSpace);
	                    
	                });

                	e.preventDefault();
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