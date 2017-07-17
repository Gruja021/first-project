app.factory('historyService', function($http, $state, APIService){
	var settings = {
		serviceURL: APIService.serverURL + "history/"
	};
	return {
		transformWord:function(value){		
			var promise = $http.post(settings.serviceURL + "transformation", value, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		convertCorpus:function(value){		
			var promise = $http.post(settings.serviceURL + "convertCorpus", value, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		saveOrEditHistory:function(value){		
			var promise = $http.post(settings.serviceURL + "saveOrEdit", value, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		getAllhistory:function(){		
			var promise = $http.get(settings.serviceURL + "dataList", APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		getOneHistory:function(value){		
			var promise = $http.post(settings.serviceURL + "info", value, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		}
	}

});