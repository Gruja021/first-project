app.factory('userService', function($http, $state, APIService){
	var settings = {
			serviceURL: APIService.serverURL + "user/"
		};

	return {		
		registerUser:function(user){		
			var promise = $http.post(settings.serviceURL + "register", user, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		loginUser:function(user){		
			var promise = $http.post(settings.serviceURL + "login", user, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		getQuestions:function(){		
			var promise = $http.get(settings.serviceURL + "questions", APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},		
		qetUsersQuestion:function(fpObj){		
			var promise = $http.post(settings.serviceURL + "questionRequest", fpObj, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		answerSecurityQuestion:function(fpObj){		
			var promise = $http.post(settings.serviceURL + "answer", fpObj, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},		
		createNewPassword:function(fpObj){		
			var promise = $http.post(settings.serviceURL + "passwordUpdate", fpObj, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		}
	};
});
