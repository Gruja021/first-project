app.factory('combinationService', function($http, $state, APIService){
	var settings = {
			serviceURL: APIService.serverURL + "combination/"
		};

	return {		
		saveCombination:function(combination){		
			var promise = $http.post(settings.serviceURL + "saveOrEdit", combination, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		editCombination:function(combinationId){		
			var promise = $http.post(settings.serviceURL + "info", {combinationId: combinationId}, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		deleteCombination:function(combinationId){		
			var promise = $http.post(settings.serviceURL + "delete", {combinationId: combinationId}, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		combinationTransform:function(combination){		
			var promise = $http.post(settings.serviceURL + "transformation", {inputWord: combination.inputWord, ruleList: combination.rulesIds}, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		}
	};
});