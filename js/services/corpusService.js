app.factory('corpusService', function($http, $state, APIService){
	var settings = {
			serviceURL: APIService.serverURL + "corpus/"
		};
		return {		
		
		getCorpusData:function(){		
			var promise = $http.get(settings.serviceURL + "page", APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		saveCorpus:function(corpus){		
			var promise = $http.post(settings.serviceURL + "saveOrEdit", corpus, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		getAllCorpus:function(){		
			var promise = $http.get(settings.serviceURL + "dataList", APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		getValueForEditCorpus:function(corpusId){		
			var promise = $http.post(settings.serviceURL + "info", corpusId, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		saveNewLanguage:function(langugae){		
			var promise = $http.post(settings.serviceURL + "newLanguage", langugae, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		saveNewDialect:function(dialect){		
			var promise = $http.post(settings.serviceURL + "newDialect", dialect, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		saveNewPeriod:function(period){		
			var promise = $http.post(settings.serviceURL + "newPeriod", period, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		getCorpusForRulePage:function(corpusId){		
			var promise = $http.post(settings.serviceURL + "getWords", corpusId, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		},
		editSaweWordInCorpus:function(obj){		
			var promise = $http.post(settings.serviceURL + "newWord", obj, APIService.headers)
			.then(function(response) {
				return response.data;
			}, function(err){
				return APIService.errorCallback(err);
			});
			return promise;
		}
	}

});