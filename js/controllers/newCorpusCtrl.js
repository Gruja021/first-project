app.controller('newCorpusCtrl', function($scope, $state, $stateParams, cookiesService, Notification, getCorpusData, corpusService, allCorpus, $timeout){
	if(allCorpus && !allCorpus.error){
		$scope.allCorpus.allCorpus = allCorpus.corpusDto;
	}else{
		Notification.error(allCorpus.message);
		$state.go("home");
	}
	if(getCorpusData && !getCorpusData.error){
		$scope.corpus = getCorpusData;
		$scope.show.clicked = 2;
	}else{
		Notification.error(getCorpusData.message);
		$state.go("home");
	}

	if(sessionStorage.corpusId){
		$scope.getValueForEditCorpus(sessionStorage.corpusId);
		delete sessionStorage.corpusId;
	}
	
	var wordList = [];

	$scope.goToOnSpace = function(event, text){
		if (event.keyCode === 32) {
			$scope.obJcorpus.text = text + '\n';
			$scope.obJcorpus.text = $scope.obJcorpus.text.replace(/\s\s+/g, '\n');
			// var wordList = $scope.obJcorpus.text.split("\n");
			// wordList.pop();
		}

	}

	// $scope.saveCorpus = function(corpus){
	// 	if($scope.obJcorpus && $scope.obJcorpus.corpusName){
	// 		$scope.obJcorpus.wordList = $scope.obJcorpus.text.split("\n");
	// 		if($scope.obJcorpus.wordList[$scope.obJcorpus.wordList.length - 1] == ''){
	// 			$scope.obJcorpus.wordList[corpus.wordList.length - 1].pop();
	// 		}
	// 		$scope.obJcorpus.username = $scope.user.username;
	// 		corpusService.saveCorpus($scope.obJcorpus)
	// 		.then(function(res) {
	// 			if(!res.error){
	// 				Notification.success(res.message || "You have succesfully saved corpus.");
	// 				if(!$scope.obJcorpus.corpusId){
	// 					$state.reload();
	// 				}
	// 				//getAllCorpusess();
	// 			}else{
	// 				Notification.error(res.message);
	// 			}
	// 		});
	// 	}else{
	// 		Notification.error("Corpus Name is required field!");
	// 	}
	// }

	// function getAllCorpusess(){
	// 	corpusService.getAllCorpus()
	// 	.then(function(res) {
	// 		if(!res.error){

	// 			$scope.allCorpus.allCorpus = res.corpusDto;
	// 			Notification.success(res.message || "You have succesfully get all corpusess.");
	// 			//var test = $scope.$parent.show;
	// 		}else{
	// 			Notification.error(res.message);
	// 		}
	// 	});
	// }

	$scope.saveNewLanguage = function(newLanguage){
		if(newLanguage){
			var language = {};
			language.languageName = newLanguage;
			corpusService.saveNewLanguage(language)
			.then(function(res) {
				if(!res.error){
					Notification.success(res.message || "You have succesfully new language.");
					var clcikNew = 'language';
					getNewCorpusData(clcikNew);
					$scope.save.newLanguage = '';
				}else{
					Notification.error(res.message);
				}
			});
		}else{
			Notification.error("Enter a language!");
		}
	}
	function getNewCorpusData(clcikNew){
		corpusService.getCorpusData()
		.then(function(res) {
			if(!res.error){
				if(clcikNew == 'language'){
					$scope.corpus.languageDto = res.languageDto;
				}else if(clcikNew == 'dialect'){
					$scope.corpus.dialectDto = res.dialectDto;
				}else if(clcikNew == 'period'){
					$scope.corpus.periodDto = res.periodDto;
				}
				
				angular.element(document).ready(function () {
					if(clcikNew == 'language'){
					    $scope.obJcorpus.languageId = res.languageDto[res.languageDto.length - 1].languageId;
					}else if(clcikNew == 'dialect'){
					    $scope.obJcorpus.dialectId = res.dialectDto[res.dialectDto.length - 1].dialectId;
					}else if(clcikNew == 'period'){
					    $scope.obJcorpus.periodId = res.periodDto[res.periodDto.length - 1].periodId;
					}
				});
			}else{
				Notification.error(res.message);
			}
		});
		removeNgDirtyClassFromElement();
	}

	$scope.saveNewDialects = function(newDialect){
		if(newDialect){
			var language = {};
			language.dialectName = newDialect;
			corpusService.saveNewDialect(language)
			.then(function(res) {
				if(!res.error){
					Notification.success(res.message || "You have succesfully new dialect.");
					var clcikNew = 'dialect';
					getNewCorpusData(clcikNew);
					$scope.save.newDialect = '';
				}else{
					Notification.error(res.message);
				}
			});
		}else{
			Notification.error("Enter a dialect!");
		}
	}
	
	$scope.saveNewPeriods = function(newPeriod){ 
		if(newPeriod){
			var language = {};
			language.periodName = newPeriod;
			corpusService.saveNewPeriod(language)
			.then(function(res) {
				if(!res.error){
					Notification.success(res.message || "You have succesfully new period.");
					var clcikNew = 'period';
					getNewCorpusData(clcikNew);
					$scope.save.newPeriod = '';
				}else{
					Notification.error(res.message);
				}
			});
		}else{
			Notification.error("Enter a period!");
		}
	}
	
	// $scope.goToFather = function(corpusId){
	// 	var objCorpusId = {};
	// 	objCorpusId.corpusId = corpusId;
	// 	corpusService.getValueForEditCorpus(objCorpusId)
	// 	.then(function(res) {
	// 		if(!res.error){
	// 			$scope.obJcorpus = res.corpusPageDto;
	// 			$scope.obJcorpus.text = res.corpusPageDto.wordList.join('\n');
	// 			Notification.success(res.message || "You have succesfully get one corpus.");
	// 			//var test = $scope.$parent.show;
	// 		}else{
	// 			Notification.error(res.message);
	// 		}
	// 	});
	// }

	$scope.goToOnHistory = function(historyId){
		sessionStorage["historyId"] = angular.copy(historyId);
		var urlHistory = $state.href('home.history.new');
		window.open(urlHistory,'_blank');	
		delete sessionStorage.historyId;
	}

	function removeNgDirtyClassFromElement(){
		var validateInput = document.getElementsByClassName("ng-dirty");
		var wrappedResult = angular.element(validateInput);
  		for (var i=0; i<wrappedResult.length; i++) {
	  		wrappedResult[i].classList.remove('ng-dirty')
  		}
	}

});