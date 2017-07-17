app.controller('newCombinationCtrl', function($scope, $state, Notification, ngDialog, combinationService){

	//setting visibility in new_combination.html for info button (not visible)
	$scope.showInfo = false;
	$scope.showSaveAs = false;

	//declaring combination object and removing unnecessary things (fixin bug because combination keep its properties if creating new combination  from edit combination)
	$scope.combination = $scope.combination;
	$scope.combination.username = $scope.user.username;
	delete $scope.combination.combinationId;
	$scope.combination.combinationName = "";
	$scope.combination.combinationDescription = "";

	//removing checkboxes from rules adding new rule to combination
	function resetRulesForCombination(rules){
		for(rule of rules){
			rule.forCombination = false;
		}
	}

	//open dialog for adding new rule to combination
	$scope.openAddNewRule = function(){
		$scope.combinationDialogText = "Add rules to combination: ";
		$scope.showCreateCombination = false;
		resetRulesForCombination($scope.rules);
		$scope.myDialog = ngDialog.open({
	    	template: "templates/dialogs/newCombination.html",
	    	className: 'ngdialog-theme-plain',
	    	scope: $scope,
	    	width: "570px",
	    	height: "400px"
    	});
	}

	//add new rule to combination
	$scope.addNewRule = function(){
		var newRulesForAdd = $scope.rules.filter(function(e){return e.forCombination == true;});
		for(newRule of newRulesForAdd){
			$scope.combination.ruleForCombinationDto.push(newRule);
			$scope.combination.rulesIds.push(newRule.ruleId);
		}
		$scope.myDialog.close();		
	}

	//open dialog for saving new combination
	$scope.openSave = function(combination){
		if(combination && combination.ruleForCombinationDto.length && combination.rulesIds.length){
			$scope.myDialog = ngDialog.open({
		    	template: "templates/dialogs/saveNewCombination.html",
		    	className: 'ngdialog-theme-plain',
		    	scope: $scope,
		    	width: $scope.dialogSettings.width,
		    	height: $scope.dialogSettings.height
	    	});
		}else{
			Notification.error("You must have at least one rule.")
		}
	}

	//save new combination to DB
	$scope.saveCombination = function(combination){
		if(combination && combination.ruleForCombinationDto.length && combination.rulesIds.length && combination.combinationName){
			combinationService.saveCombination(combination)
			.then(function(res) {
				if(!res.error){
					Notification.success(res.message || "You have succesfully saved combination.");
					$scope.myDialog.close();
					$state.go("home", {}, {reload: true});
				}else{
					Notification.error(res.message);
				}
			});
		}else{
			Notification.error("You must enter combination name");

		}
	}

});