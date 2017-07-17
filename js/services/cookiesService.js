app.factory('cookiesService', function($cookies){
return {
	setUser: function(user){
		$cookies.putObject('user', user);
	},
	getUser: function(){
		return $cookies.getObject('user');
	},
	clearCookies: function(){
		var cookies = $cookies.getAll();
		angular.forEach(cookies, function (v, k) {
    		$cookies.remove(k);
		});
	}
}

});