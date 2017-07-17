app.controller('newHistoryCtrl', function($scope, $state, Notification, ngDialog, corpusService, allCorpus, historyService){
	$scope.show.clicked = 3;
	
	//$scope.getValueForEditHistory($scope.parameter);
	if(sessionStorage.historyId){
		$scope.getValueForEditHistory(sessionStorage.historyId);
		delete sessionStorage.historyId;
	}
	
	if(allCorpus && !allCorpus.error){
		$scope.allCorpus.allCorpus = allCorpus.corpusDto;

	}else{
		Notification.error(allCorpus.message);
		$state.go("home");
	}
	var historyForTransform = {};

	$scope.addNewRuleOnHistoryPage = function(history, flag){
		if($scope.history.ruleForHistoryDto.length + 1 > $scope.rules.length){
			Notification.error("Max numbers of rules.");
			return false;
		}
		if(flag == '2'){
			var rule = {
			//position: "",
			ruleId: null
			};
			$scope.history.ruleForHistoryDto.push(rule);
		}
		
		//historyForTransform = history;
	}
	if(!$scope.history.ruleForHistoryDto){
		$scope.addNewRuleOnHistoryPage($scope.history, '1');
	}

	$scope.deleteNewRuleOnHistoryPage = function(history, index){
		if($scope.history.ruleForHistoryDto.length == 1){
			Notification.error("History must have at least one rule.");
			return false;
		}
		$scope.history.ruleForHistoryDto.splice(index, 1);
	}
	

	$scope.tarnsformHistory = function(){
		var ruleList = [];
		var nullRule = true
		for(var i=0; i<$scope.history.ruleForHistoryDto.length; i++){
			//ruleList.push(historyForTransform.ruleForHistoryDto[i].ruleId);//string
			if($scope.history.ruleForHistoryDto[i].ruleId != null){
				var oneItem = parseInt($scope.history.ruleForHistoryDto[i].ruleId);
				ruleList.push(oneItem);//int
			}else{
				nullRule = false;
				break;
			}
		}

		if(nullRule){
			if($scope.obj){
				if($scope.obj.word){
					var transformObj = {};
					transformObj.inputWord = $scope.obj.word.wordName;
					transformObj.ruleList = ruleList;
					historyService.transformWord(transformObj)
					.then(function(res) {
						if(!res.error){
							$scope.intermediateOutput.intermediateOutputArray = [];
							for (var i=0; i<res.outputList.length - 1; i++) {
								var openObj = {open:true, intermediateOutput: res.outputList[i]}
								$scope.intermediateOutput.intermediateOutputArray.push(openObj);
							}
							$scope.intermediateOutput.transformOutput = res.outputList[res.outputList.length - 1];
							Notification.success(res.message || "You have succesfully transform text.");
						}else{
							Notification.error(res.message);
						}
					});
				}else{
					Notification.error("You can not select empty corpus!");
				}
			}else{
				Notification.error("You must select any corpus!");
			}
		}else{
			Notification.error("Rule name is mandatory field!");
		}
		
	}

	if($scope.intermediateOutput){
		$scope.intermediateOutput.intermediateOutputArray = [];
		$scope.intermediateOutput.transformOutput = ''
	}

	$scope.ruleUp = function(index){
		if(index > 0){
			$scope.history.ruleForHistoryDto.move(index, index -1);
		}
	}

	$scope.ruleDown = function(index){
		if(index + 1 < $scope.history.ruleForHistoryDto.length){
			$scope.history.ruleForHistoryDto.move(index + 1, index);
		}
	}


	$scope.convertHistory = function(corpusConvert){
		if($scope.corpusConvert){

			if(!$scope.corpusConvert.corpusIdTo){
				var comparasion = checkCorpusname(corpusConvert);
				if(comparasion.length > 0){
					$scope.corpusConvertname = comparasion[0].corpusName;
					if(comparasion[0].corpusEmpty){
						doConvertHistory();
					}else{
						openDialogForConvertHistory();
					}	
				}else{
					doConvertHistory();
				}
			}else{
				var checkEmpty = checkEmptyCorpus(corpusConvert);
				if(checkEmpty[0].corpusEmpty){
					doConvertHistory();
				}else{
					$scope.corpusConvertname = checkEmpty[0].corpusName;
					openDialogForConvertHistory();
				}
			}
		}else{
			Notification.error("From corpus select box is mandatory field!");
		}
	}

	function openDialogForConvertHistory(){
		$scope.openConvertHistory = ngDialog.open({
	    	template:'templates/dialogs/convertHistory.html',
            className: 'ngdialog-theme-plain customClass',
            scope: $scope,
            width: "600px",
            height: "180px"
    	});
	}

	$scope.goOnConvert = function(){
		$scope.openConvertHistory.close();
		doConvertHistory();
	}

	$scope.closeDialog = function(){
		$scope.openConvertHistory.close();
	}

	function doConvertHistory(){
		var ruleList = [];
		var nullRule = true;
		for(var i=0; i<$scope.history.ruleForHistoryDto.length; i++){
			//ruleList.push(historyForTransform.ruleForHistoryDto[i].ruleId);//string
			if($scope.history.ruleForHistoryDto[i].ruleId != null){
				var oneItem = parseInt($scope.history.ruleForHistoryDto[i].ruleId);
				ruleList.push(oneItem);//int
			}else{
				nullRule = false;
				break;
			}
		}

		if(nullRule){
			if($scope.corpusConvert){
				var convertObj = {};
				convertObj.corpusIdFrom = parseInt($scope.corpusConvert.corpusIdFrom, 10);
				if($scope.corpusConvert.corpusIdTo){
					convertObj.corpusIdTo = parseInt($scope.corpusConvert.corpusIdTo, 10);
				}
				convertObj.ruleList = ruleList;
				historyService.convertCorpus(convertObj)
				.then(function(res) {
					if(!res.error){
						$scope.allCorpus.allCorpus = res.corpusDto;
						Notification.success(res.message || "You have succesfully transform corpus!");
					}else{
						Notification.error(res.message);
						// $scope.allCorpus.allCorpus = res.corpusDto;
					}
				});
			}
		}else{
			Notification.error("Rule is mandatory field!");
		}
	}

	function checkCorpusname(corpusConvert){
		var allCorpus = $scope.allCorpus.allCorpus;
		var oneCorpus = $scope.allCorpus.allCorpus.filter(function(e){return e.corpusId == corpusConvert.corpusIdFrom;});
		var comparisonCorpusName = $scope.allCorpus.allCorpus.filter(function(e){return e.corpusName == oneCorpus[0].corpusName + ' - copy';});
		return comparisonCorpusName;
	}

	function checkEmptyCorpus(corpusConvert){
		var checkEmpty = $scope.allCorpus.allCorpus.filter(function(e){return e.corpusId == corpusConvert.corpusIdTo;});
		return checkEmpty;
	}

	$scope.goToOnCorpus = function(corpusId){
		sessionStorage["corpusId"] = angular.copy(corpusId);
		var urlCorpus = $state.href('home.corpus.new');
		window.open(urlCorpus,'_blank');	
		delete sessionStorage.corpusId;
	}

	$scope.goToOnRule = function(ruleId){
		sessionStorage["ruleId"] = angular.copy(ruleId);
		var urlRule = $state.href('home.rule.new');
		window.open(urlRule,'_blank');	
		delete sessionStorage.ruleId;
	}

});