app.directive('aside', function(){
	function linkFunction(scope, elem, attrs){

		var resizeAside = function(){
			var pageHeight = $("#homePage").height();
			var aside = $("#asideTemplate");
			var minSize = 800;
	    	if(pageHeight > minSize){
				aside.height(pageHeight);
			}else{
				aside.height(minSize);
			}
		}
		
		$(resizeAside);
		
		$(window).on('hashchange click', resizeAside);

	}

	return{
		templateUrl: 'templates/aside.html',
		link: linkFunction,
		restrict: 'EA',
		scope: false
	}
});