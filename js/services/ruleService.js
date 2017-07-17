app.factory('ruleService', function($http, $state, APIService){
	var settings = {
			serviceURL: APIService.serverURL + "rule/"
		};

	return {		
		saveOrEdit:function(rule){		
			var promise = $http.post(settings.serviceURL + "saveOrEdit", rule, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		getDataList:function(){		
			var promise = $http.get(settings.serviceURL + "dataList", APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		editRule:function(ruleId){		
			var promise = $http.post(settings.serviceURL + "info", {ruleId: ruleId}, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		deleteRule:function(ruleId){		
			var promise = $http.post(settings.serviceURL + "delete", {ruleId: ruleId}, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		textTransform:function(rule){		
			// var promise = $http.post(settings.serviceURL + "transformation", rule, APIService.headers)
			// .then(function(response) {
			// 	return response.data;
			// }, function(err){
			// 	return APIService.errorCallback(err);
			// });
			// return promise;
			var promise = $http.post(settings.serviceURL + "transformation", rule, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		getValueForEditRule:function(ruleId){		
			var promise = $http.post(settings.serviceURL + "info", ruleId, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		}
	};
});