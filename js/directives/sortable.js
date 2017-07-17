app.directive('sortable', function($compile, $timeout){
	function linkFunction(scope, elem, attrs){

		$(function(){

			var rule = elem.find(".condition");

			function addBorder(elem, style){
				elem.css("border", style);
			}

			elem.sortable({
		      	revert: true,
		     	axis: "y",
		        handle: ".sort_btn",
		        start: function(event, ui) {
		        	rule = elem.find(".condition");
		        	addBorder(elem, "2px dashed #c07c28");
		        	addBorder(rule, "2px dashed #32A8BD");
                },
                stop: function(event, ui) {
		       		addBorder(elem, "transparent");
		        	addBorder(rule, "transparent");
                },               
                update: function(event, ui) {
                	rule = elem.find(".condition");
                	for(var i = 0; i < rule.length; i++){
                		scope.combination.rulesIds[i] = parseInt(rule[i].dataset.ruleId, 10);
                	}

					var result = [];
					for(ruleId of scope.combination.rulesIds){
						result.push(scope.combination.ruleForCombinationDto.filter(function(e){return e.ruleId == ruleId;})[0]);
					}
					scope.combination.ruleForCombinationDto = result;

					scope.$apply();
                }
		    });

		  	rule.disableSelection();

        });
		
	}

	return {
		link: linkFunction,
		restrict: 'A',
		scope: false
	};
});

