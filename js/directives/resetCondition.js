app.directive('resetCondition', function($timeout){
	function linkFunction(scope, elem, attrs){
		$timeout(function () {
	  		reset = elem.find(".reset");
	  		reset.on("click", function(){
	  			scope.condition.mOffset = '';
	  			scope.condition.mRe = '';
				scope.$apply();
			});
	  	}, 300);	
	}
	return{
		link: linkFunction,
		restrict: 'EA',
		scope: false
	}
});