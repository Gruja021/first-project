app.controller('newRuleCtrl', function($scope, $state, $stateParams, Notification, ngDialog, ruleService, allCorpus, corpusService, $timeout){
	//setting visibility in new_rule.html for info button (not visible)
	// $scope.disabled_button = true;
	$scope.showInfo = false;
	$scope.showSaveAs = false;

	//dialog settings for new rule page
	var dialogSettings = {
		height: "400px",
		width: "870px"
	};

	if(sessionStorage.ruleId){
		$scope.getValueForEditRule(sessionStorage.ruleId);
		delete sessionStorage.ruleId;
	}

	$scope.rule.syllable = 'Any';
	$scope.rule.position = '0;'
	//declaring new rule object
	// $scope.rule = {
	// 	ruleName: "",
	// 	inputWord: "",
	// 	position: "",
	// 	matchDto: [
	// 		{mOffset: "", mRe: ""}
	// 	],
	// 	tSource: "",
	// 	tDest: "",
	// 	username: $scope.user.username,
	// 	ruleDescription: "",
	// 	outputWord: ""
	// };
	//open dialog for saving new rule
	
	$scope.openSave = function(rule){
		if(rule && rule.tSource && rule.tDest){
			$scope.myDialog = ngDialog.open({
		    	template: "templates/dialogs/saveNewRule.html",
		    	className: 'ngdialog-theme-plain',
		    	scope: $scope,
		    	width: $scope.dialogSettings.width,
		    	height: $scope.dialogSettings.height
	    	});
		}else{
			Notification.error("You must enter transition source and dest.")
		}
	}

	//save rule to DB
	$scope.saveRule = function(rule){
		if(rule && rule.tSource && rule.tDest && rule.ruleName){
			ruleService.saveRule(rule)
			.then(function(res) {
				if(!res.error){
					Notification.success(res.message || "You have succesfully saved rule.");
					$scope.myDialog.close();
					$state.go("home", {}, {reload: true});
				}else{
					Notification.error(res.message);
				}
			});
		}else{
			Notification.error("You must enter rule name");

		}
	}

	//moj kod odavde
	$scope.show.clicked = 1;
	if(allCorpus && !allCorpus.error){
		$scope.allCorpus.allCorpus = allCorpus.corpusDto;
	}else{
		Notification.error(allCorpus.message);
		$state.go("home");
	}

	//moj kod odavde
	//var goOut;
	// var valueCheckbox;
	// $scope.automaticSyllable = function(valueFromCheckbox){
	// 	var filteredSplitWord = [];
	// 	valueCheckbox = valueFromCheckbox;
	// 	if($scope.obj && valueCheckbox){
	// 		var splitWord;
	// 		if(valueCheckbox == 'edit'){
	// 			splitWord = $scope.obj.word.wordName.split('');
	// 			filteredSplitWord = splitWord.filter(function(el){return el == '-'});
	// 		}else if($scope.obj.word.newWordName){
	// 			splitWord = $scope.obj.word.newWordName.split('');
	// 			filteredSplitWord = splitWord.filter(function(el){return el == '-'});//morao sam dodati isti red koda u obe grane da ne bi kasnje imao proveru da li postoji property newWorldName
	// 		}
	// 		if(($scope.rule.editAutomaticSyllable && filteredSplitWord.length == 0 && valueCheckbox == 'edit' && $scope.obj.word.wordName != '' && $scope.obj.word.wordName != undefined) || ($scope.rule.saveAutomaticSyllable && filteredSplitWord.length == 0 && valueCheckbox == 'save'  && $scope.obj.word.newWordName != ''  && $scope.obj.word.newWordName != undefined)){
	// 		//goOut = true;
	// 			analyzeWord(valueCheckbox);
	// 		}
	// 	}
	// }
	// // var part = '';
	
	// var vowels = ['a','e','i','o','u'];
	// var consonants = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','x','z','y']
	// function analyzeWord(valueCheckbox){
	// 	var wordArray = [];
	// 	//$scope.obj.word.wordName;
	// 	if(valueCheckbox == 'edit'){
	// 		wordArray.push($scope.obj.word.wordName);
	// 	}else if(valueCheckbox == 'save'){
	// 		wordArray.push($scope.obj.word.newWordName);
	// 	}
	// 	var output;
	// 	recursive(wordArray, valueCheckbox);

	// 	function recursive(wordArray, valueCheckbox){
			
	// 		var newPart = '';
	// 		var part = '';
			
	// 		var outputArray = [];
	// 		var allNew;
	// 			for(var i = 0; i < wordArray.length; i++){
	// 				var promptArray = [];
	// 				for(var c = 0; c < wordArray[i].length; c++){
	// 					var filteredVowels = vowels.filter(function(el){return el == wordArray[i][c]});
	// 					if(filteredVowels[0]){
	// 						promptArray.push(filteredVowels[0]);
	// 					}
	// 				}
	// 				if(promptArray.length > 1){
	// 					for(var a = 0; a < wordArray[i].length; a++){
	// 					 	var filteredConsonants = consonants.filter(function(el){return el == wordArray[i][a]});
	// 					 	if(filteredConsonants[0]){
	// 					 		part = part + filteredConsonants[0];
	// 					 		if(part.split('').length == 2){
	// 					 			if(!wordArray[i].startsWith(part) && !wordArray[i].endsWith(part)){
	// 					 				var subStr  = part.split('');
	// 									newPart = subStr.join('-');
	// 									allNew = wordArray[i].replace(part, newPart);
	// 					 			}
	// 					 		}
	// 					 		if(part.split('').length == 3){
	// 					 			if(!wordArray[i].startsWith(part) && !wordArray[i].endsWith(part)){
	// 						 			var subStr  = part.split('');
	// 									newPart = subStr.join('-');
	// 									newPart = newPart.replace('-', '');
	// 									allNew = wordArray[i].replace(part, newPart);
	// 								}
	// 					 		}

	// 					 	}else{
	// 					 		part = '';
	// 					 	}
	// 					}
						
	// 					if(allNew == undefined || allNew == ''){
	// 						var all = '';
	// 						for(var e = 0; e < wordArray[i].length; e++){
	// 							var filteredPartVowels = vowels.filter(function(el){return el == wordArray[i][e]});
	// 							if(filteredPartVowels[0]){
	// 								all = all + wordArray[i][e] + '-';
	// 							}else{
	// 								all = all + wordArray[i][e];
	// 							}
	// 						}
	// 						var n = all.lastIndexOf('-');
	// 						var result = all.substring(n + 1);
	// 						if(result != '-'){
	// 							var checkPart = consonants.filter(function(el){return el == result});
	// 							if(checkPart){
	// 								all = all.replace(/-([^-]*)$/,'$1');
	// 							}
	// 						}

	// 						if(all.substr(all.length - 1) == '-'){
	// 							all = all.slice(0, -1);
	// 						}
	// 						allNew = all;
	// 					}
	// 					Array.prototype.splice.apply(wordArray, [i, 1].concat(allNew.split("-")));
	// 					recursive(wordArray);
						
	// 				}
	// 			}
	// 			return;
	// 	}
	// 	if(valueCheckbox == 'edit'){
	// 		$scope.obj.word.wordName = wordArray.join('-');
	// 	}else if(valueCheckbox == 'save'){
	// 		$scope.obj.word.newWordName = wordArray.join('-');
	// 	}
		
	// 	var jump = recursive(wordArray)
	// 	return jump;
	// }

	// $scope.clickOnspaceEdit = function(event){
	// 	if (event.keyCode === 32) {
	// 		var valueCheckboxFromSpace = 'edit';
	// 		$scope.automaticSyllable(valueCheckboxFromSpace);
	// 	}
	// }
	// $scope.clickOnspaceSave = function(event){
	// 	if (event.keyCode === 32) {
	// 		var valueCheckboxFromSpace = 'save';
	// 		$scope.automaticSyllable(valueCheckboxFromSpace);
	// 	}
	// }

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
	// }

	// $scope.$on('runAutomaticSyllable', function(event, disabled_button, click){
	// 	clicks = click
	// 	$scope.disabled_button = disabled_button;
	// 	$scope.automaticSyllable(valueCheckbox);
	// });

	$scope.$on('reloadPage', function(event){
		$scope.rule = {};
	});

	// var lastFocused;
	// var lastFocusedInput;
	// 	//angular.element(".inputWord").focus(function() {
	// 		$scope.focusedTextarea = function(){
	// 			lastFocusedInput = null;
	// 			lastFocused = document.activeElement;
	// 		}
	    	
	//   	//});

	// var dynamicClass;
 //  	$scope.focusedInput = function(){
 //  		//angular.element('.focused').focus(function() {
 //  			lastFocused = null;
	//     	lastFocusedInput = document.activeElement;
	//   	//});
 //  	}

	// $scope.changeStress = function(text) {
	// 	var input;
	// 	if(lastFocused){
	// 		input = lastFocused;
	// 	}else{
	// 		input = lastFocusedInput;
	// 	}
		
	

 //    	// console.log(input);
 //    	if (input == undefined) { return; }
	//     var scrollPos = input.scrollTop;
	//     var pos = 0;
	//     var browser = ((input.selectionStart || input.selectionStart == "0") ? 
 //                   "ff" : (document.selection ? "ie" : false ) );
	//     if (browser == "ie") { 
	//       	input.focus();
	//       	var range = document.selection.createRange();
	//       	range.moveStart ("character", -input.value.length);
	//       	pos = range.text.length;
	//     }
 //    	else if (browser == "ff") { pos = input.selectionStart };

	//     var front = (input.value).substring(0, pos);  
	//     var back = (input.value).substring(pos, input.value.length); 
	//     input.value = front+text+back;
	//     pos = pos + text.length;
	//     if (browser == "ie") { 
	//       	input.focus();
	//       	var range = document.selection.createRange();
	//       	range.moveStart ("character", -input.value.length);
	//       	range.moveStart ("character", pos);
	//       	range.moveEnd ("character", 0);
	//       	range.select();
	//     }	
	//     else if (browser == "ff") {
	//       	input.selectionStart = pos;
	//       	input.selectionEnd = pos;
	//       	input.focus();
	//     }
	//     input.scrollTop = scrollPos;
	//     console.log(angular.element(input).val());
	//     angular.element(input).trigger('input');
	//     // lastFocused = null;
	//    	// lastFocusedInput = null;
 //  	}
  	
  	var clicks;
  // 	$scope.nextWord = function(){
  // 		// $scope.obj;
  // 		// $scope.cloneObj;
  // 		if($scope.obj.length - 1 > clicks){
  // 			if($scope.obj.word.wordName == $scope.cloneObj[clicks].wordName){
  // 			clicks += 1;
  // 			$scope.obj.word.wordName = $scope.obj[clicks].wordName;
	 //  		}else{
	 //  			openDialogForNextButton();
	 //  		}
  // 		}else if($scope.obj.word.wordName != $scope.cloneObj[clicks].wordName){
		// 	openDialogForNextButton();
		// }else{
  // 			Notification.error("End of corpus!");
  // 		}
  // 	}

  // 	function openDialogForNextButton(){
  //       $scope.saveAndNext = ngDialog.open({
	 //    	template:'templates/dialogs/saveAndNext.html',
  //           className: 'ngdialog-theme-plain',
  //           scope: $scope,
  //           width: "600px",
	 //    	height: "180px"
  //   	});
  // 	}

  	// $scope.nextWordFromDialog = function(){
  	// 	// $scope.obj;
  	// 	// $scope.cloneObj;
  	// 	if($scope.obj.length - 1 > clicks){
  	// 		clicks += 1;
	  // 		$scope.obj.word.wordName = $scope.obj[clicks].wordName;
  	// 	}else{
  	// 		Notification.error("End of corpus!");
  	// 	}
  	// }

  	// $scope.saveAndNextDialog = function(){
  	// 	$scope.saveAndNext.close();
  	// }

  	$scope.positionOfSylable = function(sylablePosition){
  		if($scope.obj){
  			if($scope.obj.word){
  				$scope.rule.syllable;
		  		if(sylablePosition){//added if statement
		  			$scope.obj.word.sylablePosition = sylablePosition;
		  			var positionString = getSyllablePosition();
		  			$scope.rule.position = positionString.toString();
		  			$scope.rule.syllable = sylablePosition.toString();
		  		}
  			}else{
  				Notification.error("Selected corpus can not be empty!");
  			}
  		}else{
  			Notification.error("You must select any corpus!");
  		}
  	}

  	var arrayGropName = [];
  	$scope.createArrayGroup = function(name){
  		//var groupName = name;
  		var arrayGroupLenght = arrayGropName.filter(function(el){return el == name});
  		if(arrayGroupLenght.length == 0){
  			arrayGropName.push(name);
  		}else{
  			var index = arrayGropName.indexOf(arrayGroupLenght[0]);
  			if (index > -1) {
			    arrayGropName.splice(index, 1);
			}
  		}
  	}

  	$scope.clickOnChangeStres = function(){
  		if($scope.obj){
  			if($scope.obj.insertStres){
  				$scope.obj.insertStres = undefined;
  			}
		}
  	}

  	$scope.applayGroupName = function(){
  		var groupContent = arrayGropName.join(',');
  		var conditionString;
  		if($scope.brackets){
  			conditionString = '[[:' + groupContent + ':]]';
  		}else{
  			conditionString = '[:' + groupContent + ':]';
  		}
  		
  		$scope.changeStress(conditionString);
  	}

  	$scope.resetCondition = function(){
  		removeNgDirtyClassFromElement();
  	}

  	$scope.resetTransform = function(){
  		$scope.rule.tSource = '';
  		$scope.rule.tDest = '';
  		removeNgDirtyClassFromElement();
  	}

  	function removeNgDirtyClassFromElement(){
		var validateInput = document.getElementsByClassName("ng-dirty");
		var wrappedResult = angular.element(validateInput);
  		for (var i=0; i<wrappedResult.length; i++) {
	  		wrappedResult[i].classList.remove('ng-dirty')
  		}
	}

  	$scope.deleteInInsertForm = function(){
  		$scope.class.selected = false;
  	}

  	$scope.transform = function(){
  		var validate = checkInput();
  		if(validate){
  			$scope.rule;
	  		$scope.rule.inputWord = $scope.obj.word.wordName;
	  		ruleService.textTransform($scope.rule)
			.then(function(res) {
				if(!res.error){
					Notification.success(res.message || "You have succesfully transform text.");
					$scope.rule.outputWord = res.output;
				}else{
					Notification.error(res.message);
					$scope.rule.outputWord = res.output;
				}
			});
  		}
  	}

  	function checkInput(){
  		var validateInput = true;
  		if($scope.obj){
			if($scope.obj.word){
  				if($scope.obj.word.wordName == ''){
	  				Notification.error("Word from corpus is mandatory field!");

	  				return validateInput = false;
	  			}
  			}else{
  				Notification.error("Selected corpus can not be empty!");
  				return validateInput = false;
  			}
  		}
  		// if($scope.rule.position == ''){
  		// 	Notification.error("Syllable position is mandatory field!");
  		// 	return validateInput = false;
  		// }

  		for (var i=0; i<$scope.rule.matchDto.length; i++) {
  			if($scope.rule.matchDto[i].mOffset == null){
  				$scope.rule.matchDto[i].mOffset = '';
  			}
  		}
  		if($scope.rule.tSource == ''){
  			Notification.error("Transform input is mandatory field!");
  			return validateInput = false;
  		}
  		if($scope.rule.tDest == ''){
  			Notification.error("To input is mandatory field!");
  			return validateInput = false;
  		}
  		// for (var i=0; i<$scope.rule.matchDto.length; i++) {//ovo mozda otkomentarisati ako zelimo da obavezno polje bude i bloK condition1, 2 i sl
  		// 	if($scope.rule.matchDto[i].mOffset == null){
	  	// 		Notification.error("In Syllabele in Condition" + i + 1 +" is mandatory field!");
	  	// 		return validateInput;
	  	// 		break;
	  	// 	}
	  	// 	if($scope.rule.matchDto[i].mRe == ''){
	  	// 		Notification.error("Find in Condition" + i + 1 +" is mandatory field!");
	  	// 		return validateInput;
	  	// 		break;
	  	// 	}
  		// }
  		
  		return validateInput;
  	}

  	function getSyllablePosition(){
  		var splitWordName = $scope.obj.word.wordName.split("-");
		var sylablePosition;
		switch ($scope.obj.word.sylablePosition) {
            case 'Any':
                sylablePosition = '0';
                break;
            case 'First':
                sylablePosition = '1';
                break;
            case 'Second':
                sylablePosition = '2';
                break;
            case 'Penultimate':
            	sylablePosition = '-2';
                break;
            case 'Last':
                sylablePosition = '-1';
                break;
            // case 'No ...':
            //     sylablePosition = '';
            //     break;
            default:

        }
        return sylablePosition;
  	}

  	$scope.copyContentFromInput = function(outpuWords){
  		var copyTextarea = document.querySelector('.copytext');
  		//copyTextarea.select();

		try {
		    var successful = document.execCommand('copy');
		    var msg = successful ? 'successful' : 'unsuccessful';
		    console.log('Copying text command was ' + msg);
		}catch (err) {
		    console.log('Oops, unable to copy');
		}
  	}
  	
});