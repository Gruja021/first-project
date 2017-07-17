app.directive('descriptionToggle', function(){
	function linkFunction(scope, elem, attrs){

		var descriptionBtn = elem.find(".description_btn");
		var descriptionDiv = elem.find(".description_div");

		descriptionBtn.on("click", function(){
			descriptionDiv.toggle();
		});
		
	}

	return {
		link: linkFunction,
		restrict: 'EA',
		scope: false
	};
});