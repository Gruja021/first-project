app.directive('matchHelpTransition', function(){
	function linkFunction(scope, elem, attrs){
		var helpDiv = elem.find(".helpDiv"),
			apply = elem.find(".apply_help"),
			tSource = {
				button: elem.find(".t_source_btn"),
				input: elem.find(".t_source_input")
			},
			checkboxes,
			position,
			element;

			scope.classes = [
			{name: "nasal", letters: ['m','n'], group: 1, selected: false, title: "(m,n)"},
			{name: "stop", letters: ['p','t','k','ʔ','b','d','g','ṗ','ṭ','q','ḍ'], group: 1, selected: false, title: "(p,t,k,ʔ,b,d,g,ṗ,ṭ,q,ḍ)"},
			{name: "fricative", letters: ['f','ṯ','s','ś','š','x','ḥ','h','v','ḏ','z','ž','ɣ','ʕ','t̪','ṣ','ṣ́','d̪','ż'], group: 1, selected: false, title: "(f,ṯ,s,ś,š,x,ḥ,h,v,ḏ,z,ž,ɣ,ʕ,t̪,ṣ,ṣ́,d̪,ż)"},
			{name: "affricate", letters: ['c','č','ǰ','ǧ'], group: 1, selected: false, title: "(c,č,ǰ,ǧ)"},
			{name: "approximant", letters: ['l','y','w'], group: 1, selected: false, title: "(l,y,w)"},
			{name: "trill", letters: ['r'], group: 1, selected: false, title: "(r)"},
			{name: "emphatic", letters: ['ṗ','ṭ','q','ḍ','t̪','ṣ','ṣ́','d̪','ż','c̣'], group: 2, selected: false, title: "(ṗ,ṭ,q,ḍ,t̪,ṣ,ṣ́,d̪,ż,c̣)"},
			{name: "voiceless", letters: ['p','t','k','ʔ','ṗ','ṭ','q','f','ṯ','s','ś','š','x','ḥ','h','t̪','ṣ','ṣ́','c','č','c̣'], group: 3, selected: false, title: "(p,t,k,ʔ,ṗ,ṭ,q,f,ṯ,s,ś,š,x,ḥ,h,t̪,ṣ,ṣ́,c,č,c̣)"},
			{name: "voiced", letters: ['b','d','g','ḍ','v','ḏ','z','ž','ɣ','ʕ','d̪','ż','ǰ','ǧ'], group: 3, selected: false, title: "(b,d,g,ḍ,v,ḏ,z,ž,ɣ,ʕ,d̪,ż,ǰ,ǧ)"},
			{name: "labial", letters: ['m','p','b','ṗ','f','v'], group: 4, selected: false, title: "(m,p,b,ṗ,f,v)"},
			{name: "dental", letters: ['ṯ','ḏ','t̪','d̪'], group: 4, selected: false, title: "(ṯ,ḏ,t̪,d̪)"},
			{name: "alveolar", letters: ['n','t','d','ṭ','ḍ','s','z','ṣ','ż','c','ǰ','c̣','r'], group: 4, selected: false, title: "(n,t,d,ṭ,ḍ,s,z,ṣ,ż,c,ǰ,c̣,r)"},
			{name: "lateral", letters: ['ś','ṣ́','l'], group: 4, selected: false, title: "(ś,ṣ́,l)"},
			{name: "palatal", letters: ['š','ž','č','ǧ','y'], group: 4, selected: false, title: "(š,ž,č,ǧ,y)"},
			{name: "velar/uvular", letters: ['k','g','q','x','ɣ','w'], group: 4, selected: false, title: "(k,g,q,x,ɣ,w)"},
			{name: "pharyngeal", letters: ['ḥ','ʕ'], group: 4, selected: false, title: "(ḥ,ʕ)"},
			{name: "glottal", letters: ['ʔ','h'], group: 4, selected: false, title: "(ʔ,h)"}
		];

		scope.brackets = true;

		String.prototype.insertAtPos = function(idx, rem, str) {
		    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
		};

		function getIntersectionOfArray(array1,array2){
		    var array3 = [];
		    for(var i = 0; i < array1.length; i++){
		        for(var a = 0; a < array2.length; a++){
		            if(array1[i] == array2[a]){
		                array3.push(array2[a]);
		            }
		        }
		    }
		    return array3;
		}

		function openHelp(match){
			match.button.on('click', function(){
				helpDiv.toggle();
				match.input.click();
				changeApplyBtn(match.input[0].placeholder);
				bindCheckbox();
			});
		}

		function changeApplyBtn(placeholder){
			apply[0].innerText = "Apply " + placeholder;
		}

		function getInputPos(match){
			match.input.on("click change", function(e){
				element = e.target;
				position = element.selectionStart;
				changeApplyBtn(element.placeholder);
			});
		}

		function applyClass(inputText){
			var type = $(element).data("rule-match");
			scope.rule[type] = $(element).val().insertAtPos(position, 0, inputText);
			position += inputText.length;
			scope.$apply();
		}

		function getIntersectionLetters(chosenClasses){
			var result = [];

			chosenClasses.sort(function(a, b) {return a.letters.length - b.letters.length;});

			if(chosenClasses.length == 1) return chosenClasses[0].letters;
				
			for(var l = 0; l < chosenClasses[0].letters.length; l++){
				var exists = false;
				for(var i = 1; i < chosenClasses.length; i++){					
					if(chosenClasses[i].letters.indexOf(chosenClasses[0].letters[l]) > -1){
						exists = true;
					}else{
						exists = false;
						break;
					}
				}
				if(exists) result.push(chosenClasses[0].letters[l]);				
			}
			return result;
		}

		function formBrackets(){
			var open = "[:",
				close = ":]";
			if(scope.brackets){
				open = "[" + open;
				close = close + "]";
			}
			return {open: open, close: close};
		}

		function createClassesString(chosenClasses){
			var classesArr = [];
			for(var i = 0; i < chosenClasses.length; i++){
				classesArr.push(chosenClasses[i].name);
			}
			return formBrackets().open + classesArr.join() + formBrackets().close;
		}

		function bindCheckbox(){
			checkboxes = elem.find(".helpDiv .checkbox_letters");
			checkboxes.on("change", function(){
				var chosenClasses = scope.classes.filter(function(e){return e.selected;});
				if(chosenClasses.length == 0){
					scope.intersectionLetters = "";
				}else{
					scope.intersectionLetters = getIntersectionLetters(chosenClasses).join(" ");
				}			
				scope.$apply();
			});
		}

		apply.on("click", function(){
			var chosenClasses = scope.classes.filter(function(e){return e.selected;});
			if(chosenClasses.length == 0) return false;
			applyClass(createClassesString(chosenClasses));
		});

		getInputPos(tSource);
		openHelp(tSource);
	}
	return{
		link: linkFunction,
		restrict: 'EA',
		scope: false
	}
});