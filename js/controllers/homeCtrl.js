app.controller('homeCtrl', function($scope, $state, $stateParams, cookiesService, Notification, ngDialog, ruleService, getDataList, combinationService, corpusService, historyService, allHistory, $timeout){
	$scope.show = {};
	$scope.show.clicked;
	$scope.showAllUsers = false;
	$scope.disabledInputField = true;

	//KEYBOARD SETTINGS ARE ON LOCATION: bower_components/angular-virtual-keyboard/release/angular-virtual-keyboard.js
	//SET LETTERS ON LINE 155, DEADKEYS ON LINE 180

	//Logged user
		$('.bodyOverflow').css('overflow-y', 'scroll');

	$scope.user = cookiesService.getUser();
	//Settings for most of dialogs
	$scope.dialogSettings = {
		height: "430px",
		width: "870px"
	};

	//Opening PNG in dialog 
	$scope.openConsonantPNG = function(){
		ngDialog.open({
	    	template: "ConsonantPNG",
	    	className: 'ngdialog-theme-plain',
	    	scope: $scope,
	    	width: $scope.dialogSettings.width
    	});
	}

	//Opening PNG in dialog 
	$scope.openVowelsPNG = function(){
		ngDialog.open({
	    	template: "VowelsPNG",
	    	className: 'ngdialog-theme-plain',
	    	scope: $scope
    	});
	}

	//Getting all rules and combinations from server with resolve
	if(getDataList && !getDataList.error){
		$scope.rules = getDataList.dataDtoRule;
		$scope.combinations = getDataList.dataDtoCombination;
	}else{
		Notification.error(getDataList.message);
	}

	if(allHistory && !allHistory.error){
		$scope.allHistory = allHistory.dataDtoHistory;
	}else{
		Notification.error(getDataList.message);
	}

	//After update, get rules and combinations from server
	function reloadDataList(){
		ruleService.getDataList()
		.then(function(res) {
			if(!res.error){
				$scope.rules = res.dataDtoRule;
				//$scope.combinations = res.dataDtoCombination;ovo sam ja zakomentarisao
			}else{
				Notification.error(res.message);
			}
		});
	}

	//logout (destroy cookie)
	$scope.logout = function(){
		cookiesService.clearCookies();
		$state.go("login");
		$('.bodyOverflow').css('overflow-y', 'hidden');
	}

	//going one step back from current location
	$scope.back = function(){
		var url = $state.current.name;
		var arr = url.split('.');
		arr.pop();
		url = arr.join('.');
		$state.go(url, {}, {reload: false});
	}

	// =======================================================================================================================
	// RULE

	//Open rule from aside
	function openEditDialogRule(rule){
		$scope.rule = rule;
		$scope.myDialog = ngDialog.open({
	    	template: "templates/dialogs/editRule.html",
	    	className: 'ngdialog-theme-plain',
	    	scope: $scope,
	    	width: $scope.dialogSettings.width,
	    	height: $scope.dialogSettings.height
    	});
	}

	//get rule from server
	$scope.getRuleData = function(ruleId){
		ruleService.editRule(ruleId)
		.then(function(res) {
			if(!res.error){
				openEditDialogRule(res.ruleDto);
			}else{
				Notification.error(res.message);
			}
		});		
	}

	//transfer rule data to edit screen
	$scope.editRule = function(rule){
		$scope.myDialog.close();
		$state.go("home.rule.edit", {ruleId: rule.ruleId})
	}

	//delete rule from DB
	function deleteRule(ruleId){
		ruleService.deleteRule(ruleId)
		.then(function(res) {
			if(!res.error){
				$scope.myDialog.close();
				reloadDataList();
				Notification.success(res.message || "Rule is deleted!");
			}else{
				Notification.error(res.message);
			}
		});
	}

	//open delete rule dialog (on YES it triggers deleteRule function)
	$scope.deleteRuleDialog = function(ruleId) {
		$scope.dialogMssg = "Are you sure you want to delete selected rule?";
    	ngDialog.openConfirm({
            template:'templates/dialogs/confirm.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            width: "600px",
	    	height: "150px"
        }).then(function (value) {
            deleteRule(ruleId);
        }, function (value) {

        });
	}

	// =======================================================================================================================
	// COMBINATIONS

	//Declaring combination object (because it creates from aside)
	$scope.combination = {
		username: $scope.user.username,
		ruleForCombinationDto: [],
		rulesIds: []
	}

	//Reset rules checkboxes for creating new combination
	function resetRulesForCombination(rules){
		for(rule of rules){
			rule.forCombination = false;
		}
	}

	//Opening dilaog for new combination where you can select rules
	$scope.openNewCombinationDialog = function(){
		if($scope.rules){
			$scope.showCreateCombination = true;
			$scope.combinationDialogText = "Select rules for combination: ";
			resetRulesForCombination($scope.rules);
			$scope.myDialog = ngDialog.open({
		    	template: "templates/dialogs/newCombination.html",
		    	className: 'ngdialog-theme-plain',
		    	scope: $scope,
		    	width: "570px",
		    	height: "400px"
	    	});
    	}else{
    		Notification.error("No rules available. Create rule first.");
    	}
	}

	//Creating array of rulesID (because that is what you send to server when creating combination)
	//input: array of objects
	//output: array of int
	function collectRulesIds(rulesForCombination){
		var rulesIds = [];
		for(rule of rulesForCombination){
			rulesIds.push(rule.ruleId);
		}
		return rulesIds;
	}

	//creating new combination and sending data to combination/new rute
	$scope.createNewCombination = function(){
		var rulesForCombination = $scope.rules.filter(function(e){return e.forCombination == true;});
		if(rulesForCombination.length){
			$scope.combination.ruleForCombinationDto = rulesForCombination;
			$scope.combination.rulesIds = collectRulesIds($scope.combination.ruleForCombinationDto);
			$scope.myDialog.close();
			$state.go("home.combination.new");
			if($state.current.name == "home.combination.new"){
				$state.reload("home.combination.new");
			}	
		}else{
			Notification.error("You must select at least one rule for combination.");
		}
	}

	//open combination from aside
	function openEditDialogCombination(combination){
		combination.rulesIds = collectRulesIds(combination.ruleForCombinationDto);
		$scope.combination = combination;	
		$scope.myDialog = ngDialog.open({
	    	template: "templates/dialogs/editCombination.html",
	    	className: 'ngdialog-theme-plain',
	    	scope: $scope,
	    	width: $scope.dialogSettings.width,
	    	height: $scope.dialogSettings.height
    	});
	}

	//get combination from server
	$scope.getCombinationData = function(combinationId){
		combinationService.editCombination(combinationId)
		.then(function(res) {
			if(!res.error){
				openEditDialogCombination(res.combinationDto);
			}else{
				Notification.error(res.message);
			}
		});		
	}

	//send combination data to combination/edit page
	$scope.editCombination = function(combination){
		$scope.myDialog.close();
		$state.go("home.combination.edit", {combinationId: combination.combinationId})
	}

	//delete combination from DB
	function deleteCombination(combinationId){
		combinationService.deleteCombination(combinationId)
		.then(function(res) {
			if(!res.error){
				$scope.myDialog.close();
				reloadDataList();
				Notification.success(res.message || "Combination is deleted!");
			}else{
				Notification.error(res.message);
			}
		});
	}

	//open delete combination dialog (on YES it triggers deleteCombination function)
	$scope.deleteCombinationDialog = function(combinationId) {
		$scope.dialogMssg = "Are you sure you want to delete selected combination?";
    	ngDialog.openConfirm({
            template:'templates/dialogs/confirm.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            width: "600px",
	    	height: "180px"
        }).then(function (value) {
            deleteCombination(combinationId);
        }, function (value) {

        });
	}

	//moj kod odavde
	$scope.allCorpus = {};
	$scope.getAllCorpus = function(){
		corpusService.getAllCorpus()
		.then(function(res) {
			if(!res.error){

				$scope.allCorpus.allCorpus = res.corpusDto;
				Notification.success(res.message || "You have succesfully get all corpusess.");
				//var test = $scope.$parent.show;
			}else{
				Notification.error(res.message);
			}
		});
	}
	
	$scope.saveCorpus = function(clickedButton){
		if($scope.obJcorpus && $scope.obJcorpus.corpusName){
			if($scope.obJcorpus.text){
				$scope.obJcorpus.wordList = $scope.obJcorpus.text.split("\n");
				if($scope.obJcorpus.wordList[$scope.obJcorpus.wordList.length - 1] == ''){
					$scope.obJcorpus.wordList[$scope.obJcorpus.wordList.length - 1].pop();
				}
			}else{
				$scope.obJcorpus.wordList = [];
			}
			$scope.obJcorpus.username = $scope.user.username;
			corpusService.saveCorpus($scope.obJcorpus)
			.then(function(res) {
				if(!res.error){
					Notification.success(res.message || "You have succesfully saved corpus.");
					if(!$scope.obJcorpus.corpusId){
						//$state.reload();
						$scope.obJcorpus = {};
					}
					$scope.getAllCorpus();
					if(clickedButton == 'dialog'){
						$timeout(function(){
							leavePages(true);
						}, 200);
					}else{
						stringCorpusPart = 'corpusPart';
					}
				}else{
					Notification.error(res.message);
				}
			});
		}else{
			Notification.error("Corpus Name is required field!");
		}
	}

	$scope.obJcorpus = {
		// corpusName: "",
		// dialectId: "",
		// fatherId: "",
		// historyCorpusId: "",
		// languageId: "",
		// periodId: "",
		// text: ""
	};

	$scope.getValueForEditCorpus = function(corpusId){
		$scope.obJcorpus = {};
		var objCorpusId = {};
		var corpusId = parseInt(corpusId, 10);
		objCorpusId.corpusId = corpusId;
		corpusService.getValueForEditCorpus(objCorpusId)
		.then(function(res) {
			if(!res.error){
				$scope.obJcorpus = res.corpusPageDto;
				$scope.obJcorpus.text = res.corpusPageDto.wordList.join('\n');
				Notification.success(res.message || "You have succesfully get one corpus.");
				//var test = $scope.$parent.show;
			}else{
				Notification.error(res.message);
			}
		});
	}

	$scope.emptyInput = function(){
		$scope.obJcorpus = {};
		// $state.params.eventObj = null;
  //       $state.go('home.corpus.new');
	}

	$scope.rule = {
		ruleName: "",
		inputWord: "",
		position: "0",
		matchDto: [
			{mOffset: "", mRe: "", mn: false}
		],
		tSource: "",
		tDest: "",
		username: $scope.user.username,
		ruleDescription: "",
		outputWord: ""
	};


	$scope.history = {
		username: "",
	    historyName: "",
	    corpusId : null,
	    ruleForHistoryDto: [
		    {
		        ruleId: null
		    }
	    ]
	};

	$scope.getCorpusForRulePage = function(corpusId){
		$scope.obj = {};
		var objCorpusId = {};
		var corpusId = parseInt(corpusId, 10);
		objCorpusId.corpusId = corpusId;
		corpusService.getCorpusForRulePage(objCorpusId)
		.then(function(res) {
			if(!res.error){
				// $scope.obj.list = res.corpusPageDto.wordList;
				Notification.success(res.message || "You have succesfully get one corpus.");
				// $scope.obj.word = $scope.obj.list[0];
				$scope.obj = res.wordDto;
				$scope.cloneObj = angular.copy($scope.obj);
				if(res.wordDto.length > 0){
					$scope.obj.word = res.wordDto[0];
					$scope.obj.word.corpusId = corpusId;
				}else{
					$scope.obj[0] = {};
					$scope.obj[0].wordId = '';
					$scope.obj[0].wordName = '';
					$scope.obj.word = {};
					$scope.obj.word.wordId = '';
					$scope.obj.word.wordName = '';
					$scope.obj.word.corpusId = corpusId;
					$scope.cloneObj = angular.copy($scope.obj);
					//$scope.obj.word = [];
				}
				var disabled_button = false;
				var click = 0;
				//$scope.$broadcast ('runAutomaticSyllable', disabled_button, click);
				runAutomaticSyllable(disabled_button, click);
			}else{
				Notification.error(res.message);
			}
		});
	}
	$scope.emptyInputOnRulePagepus = function(){
		// if($scope.corpus){
		// 	$scope.corpus.corpusId = '';
		// }else{
		// 	$scope.corpus = {};
		// 	$scope.corpus.corpusId = '';
		// }
		// $scope.obj = {};
		resetBluePart();
	}

	$scope.saveOrEditRule = function(clickedButton){
		var rule = $scope.rule;
		if($scope.obj && $scope.obj.word){
			if(rule.ruleName){
				for (var i=0; i<rule.matchDto.length; i++) {
					if(rule.matchDto[i].mOffset == null){
						rule.matchDto[i].mOffset = '';
					}
				}
				if(!rule.syllable){
					rule.syllable = '';
				}
				var ruleValue = rule;
				ruleValue.corpusId = $scope.obj.word.corpusId;
				ruleValue.inputWord = $scope.obj.word.wordName;
				saveRule(ruleValue, clickedButton);
			}else{
				$scope.leavePage.close();
				Notification.error('Rule Name  is mandatory field!');
			}
		}else{
			$scope.leavePage.close();
			Notification.error('Corpus is mandatory field!');
		}
		
	}

	function saveRule(ruleValue, clickedButton){
		ruleService.saveOrEdit(ruleValue)
			.then(function(res) {
				if(!res.error){
					Notification.success(res.message || "You have succesfully saved rule.");
					//$state.reload();
					$scope.newRule = {};
					$scope.newRule.ruleName = ruleValue.ruleName;
					$scope.newRule.ruleDescription = ruleValue.ruleDescription;
					$scope.newRule.ruleId = ruleValue.ruleId;
					// if(!ruleValue.ruleId){
					// 	$scope.rules.push($scope.newRule);
					// }
					reloadDataList();
					if(clickedButton == 'dialog'){
						$timeout(function(){
							leavePages(true);
						}, 200);
					}else{
						stringBlueInputFirtst = 'firstInputBlue';
				  		stringBlueInputSecond = 'secondInputBlue';
				  		stringRulePart = 'rulePart';
					}
				}else{
					Notification.error(res.message);
				}
			});
	}

	$scope.newRule = function(){
		//$scope.$broadcast ('reloadPage');
		$scope.rule = {
			ruleName: "",
			inputWord: "",
			position: "",
			matchDto: [
				{mOffset: "", mRe: ""}
			],
			tSource: "",
			tDest: "",
			username: $scope.user.username,
			ruleDescription: "",
			outputWord: ""
		};
		resetBluePart();
	}
	function resetBluePart(){
		// 	if($scope.corpusEdit){
		$scope.rule.editAutomaticSyllable = false;
		valueCheckbox = false;
		$scope.corpus = {};
		$scope.corpus.corpusId = '';
		$scope.corpusEdit = {};
		$scope.corpusEdit.corpusId = '';

		$scope.obj = {};
		//}
		//$scope.obj.stress = '';
		var disabled_button = true;
		var click = 0;
		$scope.$broadcast ('runAutomaticSyllable', disabled_button, click);
		runAutomaticSyllable(disabled_button, click);
	}
	//$scope.corpus = {};
	$scope.getValueForEditRule = function(id){
		var ruleId = {};
		ruleId.ruleId = id;
		ruleService.getValueForEditRule(ruleId)
		.then(function(res) {
			if(!res.error){
				// $scope.obJcorpus = res.corpusPageDto;
				// $scope.obJcorpus.text = res.corpusPageDto.wordList.join('\n');
				Notification.success(res.message || "You have succesfully get one rule.");
				$scope.corpusEdit = {};
				$scope.corpusEdit.corpusId = res.ruleDto.corpusId;
				$scope.getCorpusForRulePage(res.ruleDto.corpusId);
				$scope.ruleEdit = {};
				//$scope.rule.position = res.ruleDto.position;
				$scope.rule = {};
				$scope.rule = res.ruleDto;
				$scope.ruleEdit.syllable = res.ruleDto.syllable;
				//var test = $scope.$parent.show;
			}else{
				Notification.error(res.message);
			}
		});
	}

	//blue dialog
	function runAutomaticSyllable(disabled_button, click){
		clicks = click
		$scope.disabled_button.disable = disabled_button;
		$scope.automaticSyllable(valueCheckbox);
	}
	var valueCheckbox;
	$scope.automaticSyllable = function(valueFromCheckbox){
		var filteredSplitWord = [];
		valueCheckbox = valueFromCheckbox;
		var notAllowedFlag;
		// if(valueFromCheckbox){
		// 	valueCheckbox = 'edit';
		// }else{
		// 	valueCheckbox = 'unedited';
		// }
		if($scope.obj && valueCheckbox){
			if($scope.obj.word){
				var flagFirst = $scope.obj.word.wordName.indexOf('ʔ');
				var	flagSecond = $scope.obj.word.wordName.indexOf('ʕ');
				if(flagFirst != -1 || flagSecond != -1){
					var notAllowedVoice = ['ɬʔ','pʔ','tʔ','dʔ','sʔ','ðʔ','kʔ','ɬʕ','pʕ','tʕ','dʕ','sʕ','ðʕ','kʕ'];
					var test;
					for (var i=0; i<notAllowedVoice.length; i++) {
						// $scope.obj.word.wordName = $scope.obj.word.wordName.replace(RegExp(notAllowedVoice[i], "g"), '*'+notAllowedVoice[i]+'*');
						var test = $scope.obj.word.wordName.indexOf(notAllowedVoice[i]);
						if(test){
							notAllowedFlag = false;
							break;
						}else{
							notAllowedFlag = true;
						}
					}
					if(notAllowedFlag){
						checkLine(valueCheckbox);
					}else{
						openNotAllowedSyllabisationDialog();
					}
				}else{
					checkLine(valueCheckbox);
				}
			}
		}
		

		// if($scope.obj && valueCheckbox){
		// 	var splitWord;
		// 	if(valueCheckbox == true){
		// 		splitWord = $scope.obj.word.wordName.split('');
		// 		filteredSplitWord = splitWord.filter(function(el){return el == '-'});
		// 	}else if($scope.obj.word.newWordName){
		// 		splitWord = $scope.obj.word.newWordName.split('');
		// 		filteredSplitWord = splitWord.filter(function(el){return el == '-'});//morao sam dodati isti red koda u obe grane da ne bi kasnje imao proveru da li postoji property newWorldName
		// 	}
		// 	if(($scope.rule.editAutomaticSyllable && filteredSplitWord.length == 0 && valueCheckbox == true && $scope.obj.word.wordName != '' && $scope.obj.word.wordName != undefined) || ($scope.rule.saveAutomaticSyllable && filteredSplitWord.length == 0 && valueCheckbox && $scope.obj.word.newWordName != ''  && $scope.obj.word.newWordName != undefined)){
		// 	//goOut = true;
		// 		analyzeWord(valueCheckbox);
		// 	}
		// }
	}

	function checkLine(valueCheckbox){
		//if($scope.obj && valueCheckbox){
			var splitWord;
			if(valueCheckbox == true){
				splitWord = $scope.obj.word.wordName.split('');
				filteredSplitWord = splitWord.filter(function(el){return el == '-'});
			}else if($scope.obj.word.newWordName){
				splitWord = $scope.obj.word.newWordName.split('');
				filteredSplitWord = splitWord.filter(function(el){return el == '-'});//morao sam dodati isti red koda u obe grane da ne bi kasnje imao proveru da li postoji property newWorldName
			}
			if(($scope.rule.editAutomaticSyllable && filteredSplitWord.length == 0 && valueCheckbox == true && $scope.obj.word.wordName != '' && $scope.obj.word.wordName != undefined) || ($scope.rule.saveAutomaticSyllable && filteredSplitWord.length == 0 && valueCheckbox && $scope.obj.word.newWordName != ''  && $scope.obj.word.newWordName != undefined)){
			//goOut = true;
				analyzeWord(valueCheckbox);
			}
		//}
	}

	function openNotAllowedSyllabisationDialog(){
		$scope.syllabisationDialog = ngDialog.open({
	    	template:'templates/dialogs/syllabisationDialog.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            width: "800px",
	    	height: "220px"
    	});
	}

	$scope.closeSylabisationDialog = function(){
		$scope.syllabisationDialog.close();
	}
	// var part = '';
	
	//var vowels = ['a','ă','e','ə','i','o','u','ɛ','y','ā','ē','ī','ō','ū','ɒ','ɔ'];
	var vowels = ['ə','ɒ','ă','ɔ','a','ā','e','ē','i','ī','o','ō','u','ū','ɛ','y','ě','ŏ'];
	var consonants = ['b','c','d','f','g','h','j','k','l','m','n','ɲ','p','q','r','s','t','v','x','z','ʔ','ʕ','ɬ','θ','ð','ʃ','ɣ','ћ','ʦ','ʧ','ʣ','ʤ','w'];
	function analyzeWord(valueCheckbox){
		var wordArray = [];
		//$scope.obj.word.wordName;
		if(valueCheckbox == true){
			wordArray.push($scope.obj.word.wordName);
		}else if(valueCheckbox){
			wordArray.push($scope.obj.word.newWordName);
		}
		var output;
		recursive(wordArray, valueCheckbox);

		function recursive(wordArray, valueCheckbox){
			
			var newPart = '';
			var part = '';
			
			var outputArray = [];
			var allNew;
				for(var i = 0; i < wordArray.length; i++){
					var promptArray = [];
					for(var c = 0; c < wordArray[i].length; c++){
						var filteredVowels = vowels.filter(function(el){return el == wordArray[i][c]});
						if(filteredVowels[0]){
							promptArray.push(filteredVowels[0]);
						}
					}
					if(promptArray.length > 1){
						for(var a = 0; a < wordArray[i].length; a++){
						 	var filteredConsonants = consonants.filter(function(el){return el == wordArray[i][a]});
						 	if(filteredConsonants[0]){
						 		part = part + filteredConsonants[0];
						 		if(part.split('').length == 2){
						 			if(!wordArray[i].startsWith(part) && !wordArray[i].endsWith(part)){
						 				var subStr  = part.split('');
										newPart = subStr.join('-');
										allNew = wordArray[i].replace(part, newPart);
						 			}
						 		}
						 		if(part.split('').length == 3){
						 			if(!wordArray[i].startsWith(part) && !wordArray[i].endsWith(part)){
							 			var subStr  = part.split('');
										newPart = subStr.join('-');
										newPart = newPart.replace('-', '');
										allNew = wordArray[i].replace(part, newPart);
									}
						 		}

						 	}else{
						 		part = '';
						 	}
						}
						
						if(allNew == undefined || allNew == ''){
							var all = '';
							for(var e = 0; e < wordArray[i].length; e++){
								var filteredPartVowels = vowels.filter(function(el){return el == wordArray[i][e]});
								if(filteredPartVowels[0]){
									all = all + wordArray[i][e] + '-';
								}else{
									all = all + wordArray[i][e];
								}
							}
							var n = all.lastIndexOf('-');
							var result = all.substring(n + 1);
							if(result != '-'){
								var checkPart = consonants.filter(function(el){return el == result});
								if(checkPart){
									all = all.replace(/-([^-]*)$/,'$1');
								}
							}

							if(all.substr(all.length - 1) == '-'){
								all = all.slice(0, -1);
							}
							allNew = all;
						}
						Array.prototype.splice.apply(wordArray, [i, 1].concat(allNew.split("-")));
						recursive(wordArray);
						
					}
				}
				return;
		}
		if(valueCheckbox == true){
			$scope.obj.word.wordName = wordArray.join('-');
		}else if(valueCheckbox){
			$scope.obj.word.newWordName = wordArray.join('-');
		}
		
		var jump = recursive(wordArray)
		return jump;
	}

	$scope.clickOnspaceEdit = function(event){
		if (event.keyCode === 32) {
			var valueCheckboxFromSpace = true;
			$scope.automaticSyllable(valueCheckboxFromSpace);
		}
	}
	$scope.clickOnspaceSave = function(event){
		if (event.keyCode === 32) {
			var valueCheckboxFromSpace = false;
			$scope.automaticSyllable(valueCheckboxFromSpace);
		}
	}

	$scope.editWord = function(valueFromDialog){
		//var test = $scope.obj;
		if($scope.obj.word.wordName != '' && $scope.obj.word.wordName != undefined){
			$scope.obj[clicks].wordName = $scope.obj.word.wordName;
			$scope.obj[clicks].corpusId = $scope.obj.word.corpusId;
			corpusService.editSaweWordInCorpus($scope.obj[clicks])
			.then(function(res) {
				if(!res.error){
					Notification.success(res.message || "You have succesfully edit word.");
					$scope.cloneObj[clicks].wordName = $scope.obj.word.wordName;
					clicks += 1;
					if(valueCheckbox == true){
	  					$scope.obj.word.wordName = $scope.obj[clicks].wordName;
	  					$scope.automaticSyllable(valueCheckbox);
					}else{
	  					$scope.obj.word.wordName = $scope.obj[clicks].wordName;
					}
				}else{
					Notification.error(res.message);
				}
			});
		}else{
			Notification.error("Empty input field.");
		}
	}

	// $scope.saveWord = function(){
	// 	if($scope.obj.word.newWordName != '' && $scope.obj.word.newWordName != undefined){
	// 		var saveWordObj = {};
	// 		saveWordObj.wordName = $scope.obj.word.newWordName;
	// 		saveWordObj.corpusId = $scope.obj.word.corpusId;
	// 		//var test = $scope.obj;
	// 		corpusService.editSaweWordInCorpus(saveWordObj)
	// 		.then(function(res) {
	// 			if(!res.error){
	// 				Notification.success(res.message || "You have succesfully edit word.");
	// 				var objForInsert = {};
	// 				objForInsert.wordId = saveWordObj.corpusId;
	// 				objForInsert.wordName = saveWordObj.wordName;
	// 				$scope.obj.push(objForInsert);
	// 				$scope.cloneObj.push(objForInsert);
	// 				$scope.obj.word.newWordName = '';
	// 				$scope.obj.word.wordName = objForInsert.wordName;
	// 				clicks = $scope.obj.length - 1;
	// 			}else{
	// 				Notification.error(res.message);
	// 			}
	// 		});
	// 	}else{
	// 		Notification.error("Empty input field.");
	// 	}
	// 	
	// }
	var lastFocused;
	var lastFocusedInput;
		//angular.element(".inputWord").focus(function() {
			$scope.focusedTextarea = function(){
				lastFocusedInput = null;
				lastFocused = document.activeElement;
			}
	    	
	  	//});

	var dynamicClass;
  	$scope.focusedInput = function(){
  		//angular.element('.focused').focus(function() {
  			lastFocused = null;
	    	lastFocusedInput = document.activeElement;
	  	//});
  	}

  	$scope.clickOnChangeStres = function(){
		if($scope.obj.stress){
			$scope.obj.stress = undefined;
		}
	}

	$scope.changeStress = function(text) {
		var input;
		if(lastFocused){
			input = lastFocused;
		}else{
			input = lastFocusedInput;
		}

		// console.log(input);
    	if (input == undefined) { return; }
	    var scrollPos = input.scrollTop;
	    var pos = 0;
	    var browser = ((input.selectionStart || input.selectionStart == "0") ? 
                   "ff" : (document.selection ? "ie" : false ) );
	    if (browser == "ie") { 
	      	input.focus();
	      	var range = document.selection.createRange();
	      	range.moveStart ("character", -input.value.length);
	      	pos = range.text.length;
	    }
    	else if (browser == "ff") { pos = input.selectionStart };

	    var front = (input.value).substring(0, pos);  
	    var back = (input.value).substring(pos, input.value.length); 
	    input.value = front+text+back;
	    pos = pos + text.length;
	    if (browser == "ie") { 
	      	input.focus();
	      	var range = document.selection.createRange();
	      	range.moveStart ("character", -input.value.length);
	      	range.moveStart ("character", pos);
	      	range.moveEnd ("character", 0);
	      	range.select();
	    }	
	    else if (browser == "ff") {
	      	input.selectionStart = pos;
	      	input.selectionEnd = pos;
	      	input.focus();
	    }
	    input.scrollTop = scrollPos;
	    // console.log(angular.element(input).val());
	    angular.element(input).trigger('input');
	    // lastFocused = null;
	   	// lastFocusedInput = null;
	}

	$scope.clickOnspaceEdit = function(event){
		if (event.keyCode === 32) {
			var valueCheckboxFromSpace = true;
			$scope.automaticSyllable(valueCheckboxFromSpace);
		}
	}
	$scope.clickOnspaceSave = function(event){
		if (event.keyCode === 32) {
			var valueCheckboxFromSpace = false;
			$scope.automaticSyllable(valueCheckboxFromSpace);
		}
	}

	// $scope.editWord = function(valueFromDialog){
	// 	//var test = $scope.obj;
	// 	if($scope.obj.word.wordName != '' && $scope.obj.word.wordName != undefined){
	// 		$scope.obj[clicks].wordName = $scope.obj.word.wordName;
	// 		$scope.obj[clicks].corpusId = $scope.obj.word.corpusId;
	// 		corpusService.editSaweWordInCorpus($scope.obj[clicks])
	// 		.then(function(res) {
	// 			if(!res.error){
	// 				Notification.success(res.message || "You have succesfully edit word.");
	// 				// $scope.obj[clicks].wordName = $scope.obj.word.wordName;
	// 				$scope.cloneObj[clicks].wordName = $scope.obj.word.wordName;
	// 				// if(valueFromDialog == 'saveWithNext'){
	// 				// 	clicks += 1;
	// 				// }
	// 			}else{
	// 				Notification.error(res.message);
	// 			}
	// 		});
	// 	}else{
	// 		Notification.error("Empty input field.");
	// 	}
	// }

	$scope.saveWord = function(){
		if($scope.obj.word.newWordName != '' && $scope.obj.word.newWordName != undefined){
			var saveWordObj = {};
			saveWordObj.wordName = $scope.obj.word.newWordName;
			saveWordObj.corpusId = $scope.obj.word.corpusId;
			//var test = $scope.obj;
			corpusService.editSaweWordInCorpus(saveWordObj)
			.then(function(res) {
				if(!res.error){
					Notification.success(res.message || "You have succesfully edit word.");
					var objForInsert = {};
					objForInsert.wordId = saveWordObj.corpusId;
					objForInsert.wordName = saveWordObj.wordName;
					$scope.obj.push(objForInsert);
					$scope.cloneObj.push(objForInsert);
					$scope.obj.word.newWordName = '';
					$scope.obj.word.wordName = objForInsert.wordName;
					clicks = $scope.obj.length - 1;
					stringBlueInputSecond = 'secondInputBlue';
				}else{
					Notification.error(res.message);
				}
			});
		}else{
			Notification.error("Empty input field.");
		}
	}

	$scope.nextWord = function(){
  		// $scope.obj;
  		// $scope.cloneObj;
  		if($scope.obj.length - 1 > clicks){
  			if($scope.obj.word.wordName == $scope.cloneObj[clicks].wordName){
	  			if(valueCheckbox == true){
	  				var splitWord;
	  				splitWord = $scope.obj.word.wordName.split('');
					filteredSplitWord = splitWord.filter(function(el){return el == '-'});
	  				if(filteredSplitWord.length == 0){
	  					//openDialogForNextButton();//mozda vratiti
	  					clicks += 1;
	  					$scope.obj.word.wordName = $scope.obj[clicks].wordName;
	  					$scope.automaticSyllable(valueCheckbox);
	  				}else{
	  					clicks += 1;
	  					$scope.obj.word.wordName = $scope.obj[clicks].wordName;
	  					$scope.automaticSyllable(valueCheckbox);
	  				}
	  			}else{
	  				clicks += 1;
	  				$scope.obj.word.wordName = $scope.obj[clicks].wordName;
	  			}
	  		}else{
	  			openDialogForNextButton();
	  		}
  		}else if($scope.obj.word.wordName != $scope.cloneObj[clicks].wordName){
			openDialogForNextButton();
		}else{
  			Notification.error("End of corpus!");
  		}
  	}

  	function openDialogForNextButton(){
        $scope.saveAndNext = ngDialog.open({
	    	template:'templates/dialogs/saveAndNext.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            width: "600px",
	    	height: "180px"
    	});
  	}

  	$scope.nextWordFromDialog = function(){
  		// $scope.obj;
  		// $scope.cloneObj;
  		stringBlueInputFirtst = 'firstInputBlue';
  		if($scope.obj.length - 1 > clicks){
  			clicks += 1;
			if($scope.obj && valueCheckbox == true){
				$scope.obj.word.wordName = $scope.obj[clicks].wordName;
				$scope.automaticSyllable(valueCheckbox);
			}else{
				$scope.obj.word.wordName = $scope.obj[clicks].wordName;
			}
  		}else{
  			Notification.error("End of corpus!");
  		}
  	}

  	$scope.saveAndNextDialog = function(){
  		$scope.saveAndNext.close();
  	}
  	$scope.disabled_button = {};
  	$scope.disabled_button.disable = true;

  	var historyObj = {};
  	$scope.saveOrEditHistory = function(clickedButton){
  		var history = $scope.history;
  		if($scope.obj){
			if(history.historyName != ''){
  				if(history.ruleForHistoryDto[0].ruleId){
  					historyObj.historyName = history.historyName;
			  		historyObj.ruleForHistoryDto = history.ruleForHistoryDto;
			  		historyObj.username = $scope.user.username;
			  		historyObj.corpusId = $scope.obj.word.corpusId;
			  		if(historyIdObj.historyId){
			  			historyObj.historyId = historyIdObj.historyId;
			  		}
			  		historyService.saveOrEditHistory(historyObj)
					.then(function(res) {
						if(!res.error){
							Notification.success(res.message || "You have succesfully save history!");

							if(!historyIdObj.historyId){
								$state.transitionTo($state.current, $stateParams, {
								    reload: true,
								    inherit: false,
								    notify: true
								});
							}else{
								refreschHistoryList();
							}
						}else{
							Notification.error(res.message);
						}
						stringHistoryPart = 'historyPart';
						stringBlueInputFirtst = 'firstInputBlue';
						if(clickedButton == 'dialog'){
							$timeout(function(){
								leavePages(true);
							}, 200);
						}
					});
  				}else{
  					if($scope.leavePage){
		  				$scope.leavePage.close();
		  			}
  					Notification.error('Rule is mandatory field!');
  				}
  			}else{
  				if($scope.leavePage){
	  				$scope.leavePage.close();
	  			}
  				Notification.error('History Name is mandatory field!');
  			}
  		}else{
  			if($scope.leavePage){
  				$scope.leavePage.close();
  			}
  			Notification.error('Corpus is mandatory field!');
  		}
  	}

  	function refreschHistoryList(){
  		historyService.getAllhistory()
		.then(function(res) {
			if(!res.error){
				$scope.allHistory = res.dataDtoHistory;
			}else{
				Notification.error(res.message);
			}
		});
  	}

  	function leavePages(data){
  		if(data){
			leavePage();
		}else{
			$scope.stay();
		}
  	}

  	var historyIdObj = {};
  	$scope.intermediateOutput = {};
  	$scope.intermediateOutput.intermediateOutputArray = [{open: false}];
  	$scope.getValueForEditHistory = function(historyId){
  		
  		historyIdObj.historyId = historyId;
  		historyService.getOneHistory(historyIdObj)
		.then(function(res) {
			if(!res.error){
				$scope.history = {};
				$scope.editHistory = {};
				$scope.history = res.historyDto;
				$scope.intermediateOutput.intermediateOutputArray = [];
				$scope.intermediateOutput.transformOutput = '';
				 $timeout(function(){
					for(var i=0; i<$scope.history.ruleForHistoryDto.length; i++){
						$scope.history.ruleForHistoryDto[i].ruleIdtest = $scope.history.ruleForHistoryDto[i].ruleId;
						var openObj = {open:false}
						$scope.intermediateOutput.intermediateOutputArray.push(openObj);
					}
				});
				$scope.corpusEdit = {};
				$scope.corpusEdit.corpusId = res.historyDto.corpusId;
				$scope.getCorpusForRulePage(res.historyDto.corpusId);
				Notification.success(res.message || "You have succesfully get one history!");
			}else{
				Notification.error(res.message);
			}
		});
  	}

  	$scope.clearAllInput = function(){
  		historyIdObj = {};
  		$state.transitionTo($state.current, $stateParams, {
		    reload: true,
		    inherit: false,
		    notify: true
		});
  	}

  	///////////redirect page
  	var typePage;
  	$scope.goOnRulePage = function(type){
  		typePage = type;
  		if(stringBlueInputFirtst != 'firstInputBlue' || stringBlueInputSecond != 'secondInputBlue' || stringHistoryPart != 'historyPart' || stringRulePart != 'rulePart' || stringCorpusPart != 'corpusPart'){
  			openDialogForLeavePage();
  		}else{
  			leavePage();
  		}
  	}
  	$scope.saveAllOnHistory = function(){
  		if(stringBlueInputFirtst != 'firstInputBlue'){
  			$scope.editWord();
  		}
  		if(stringBlueInputSecond != 'secondInputBlue'){
  			$scope.saveWord();
  		}
  		if(stringHistoryPart != 'historyPart'){
  			$scope.saveOrEditHistory('dialog');
  		}
  		if(stringRulePart != 'rulePart'){
  			$scope.saveOrEditRule('dialog');
  		}
  		if(stringCorpusPart != 'corpusPart'){
  			$scope.saveCorpus('dialog');
  		}
  	}

  	function openDialogForLeavePage(){
        $scope.leavePage = ngDialog.open({
	    	template:'templates/dialogs/leavePage.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            width: "700px",
	    	height: "180px"
    	});
  	}

  	$scope.leave = function(){
  		leavePage();
  	}

  	$scope.stay = function(){
  		$scope.leavePage.close();
  	}

  	function leavePage(){
  		if(typePage == 'rule'){
  			$scope.getAllCorpus();
	  		$scope.show.clicked = 1;
	  		$scope.emptyInputOnRulePagepus();
	  		setEmptyRuleObject();
  			$state.go('home.rule.new');
  		}else if(typePage == 'history'){
  			$scope.emptyInputOnRulePagepus();
	  		$scope.show.clicked = 3;
	  		setEmptyHistoryObject();
  			$state.go('home.history.new');
  		}else if(typePage == 'corpus'){
  			$scope.getAllCorpus();
  			$scope.show.clicked = 2;
  			$scope.emptyInput();
  			$state.go('home.corpus.new');
  		}
  		stringBlueInputFirtst = 'firstInputBlue';
  		stringBlueInputSecond = 'secondInputBlue'
  		stringHistoryPart = 'historyPart';
  		stringRulePart = 'rulePart';
  		stringCorpusPart = 'corpusPart';
  		if($scope.leavePage){
  			$scope.leavePage.close();
  		}
  	}

  	function setEmptyRuleObject(){
  		$scope.rule = {
			ruleName: "",
			inputWord: "",
			position: "",
			matchDto: [
				{mOffset: "", mRe: ""}
			],
			tSource: "",
			tDest: "",
			username: $scope.user.username,
			ruleDescription: "",
			outputWord: ""
		};
  	}

  	function setEmptyHistoryObject(){
  		$scope.history = {
			username: "",
		    historyName: "",
		    corpusId : '',
		    ruleForHistoryDto: [
			    {
			        ruleId: ''
			    }
		    ]
		};
  	}

  	var checkChangeCountFirstBlue = 0;
  	var stringBlueInputFirtst = 'firstInputBlue';
  	$scope.checkChangeFirstBlueInput = function(){
  		checkChangeCountFirstBlue++;
  		stringBlueInputFirtst = stringBlueInputFirtst + checkChangeCountFirstBlue;
  	}

  	var checkChangeCountSecondBlue = 0;
  	var stringBlueInputSecond = 'secondInputBlue';
  	$scope.checkChangeSecondBlueInput = function(){
  		checkChangeCountSecondBlue++;
  		stringBlueInputSecond = stringBlueInputSecond + checkChangeCountSecondBlue;
  	}

  	var checkChangeCountOnHistoryPart = 0;
  	var stringHistoryPart = 'historyPart';
  	$scope.checkChangeHistoryPart = function(){
  		checkChangeCountOnHistoryPart++;
  		stringHistoryPart = stringHistoryPart + checkChangeCountOnHistoryPart;
  	}

  	var checkChangeCountOnRulePart = 0;
  	var stringRulePart = 'rulePart';
  	$scope.checkChangeRulePart = function(){
  		checkChangeCountOnRulePart++;
  		stringRulePart = stringRulePart + checkChangeCountOnRulePart;
  	}

  	var checkChangeCountOnCorpusPart = 0;
  	var stringCorpusPart = 'corpusPart';
  	$scope.checkChangeCorpusPart = function(){
  		checkChangeCountOnCorpusPart++;
  		stringCorpusPart = stringCorpusPart + checkChangeCountOnCorpusPart;
  	}

});