app.directive('matchHelp', function($timeout){
	function linkFunction(scope, elem, attrs){
	
	$timeout(function () {
		var helpDiv = elem.find(".helpDiv"),
			apply = elem.find(".apply_help"),
			mOffset = {
				button: elem.find(".m_offset_btn"),
				input: elem.find(".m_offset_input")
			},
			mRe = {
				button: elem.find(".m_re_btn"),
				input: elem.find(".m_re_input")
			},
			checkboxes,
			position,
			element;
		// scope.condition = {};
		// scope.condition.mOffset = '';

		scope.classes = [
			{name: "consonants", letters: ['b','c','d','f','g','h','j','k','l','m','n','ɲ','p','q','r','s','t','v','x','z','ʔ','ʕ','ɬ','θ','ð','ʃ','ɣ','ћ','ʦ','ʧ','ʣ','ʤ','w','ɬʔ','pʔ','tʔ','dʔ','sʔ','ðʔ','kʔ','ɬʕ','pʕ','tʕ','dʕ','sʕ','ðʕ','kʕ'], group: 1, selected: false, title: "(b,c,d,f,g,h,j,k,l,m,n,ɲ,p,q,r,s,t,v,x,z,ʔ,ʕ,ɬ,θ,ð,ʃ,ɣ,ћ,ʦ,ʧ,ʣ,ʤ,w,ɬʔ,pʔ,tʔ,dʔ,sʔ,ðʔ,kʔ,ɬʕ,pʕ,tʕ,dʕ,sʕ,ðʕ,kʕ)"},
			{name: "nasal", letters: ['m','n','ɲ'], group: 1, selected: false, title: "(m,n,ɲ)"},
			{name: "stop", letters: ['p','t','k','ʔ','b','d','g','pʔ','pʕ','tʔ','tʕ','kʔ','kʕ','dʔ','dʕ'], group: 1, selected: false, title: "(p,t,k,ʔ,b,d,g,pʔ,pʕ,tʔ,tʕ,kʔ,kʕ,dʔ,dʕ)"},
			{name: "fricative", letters: ['f','θ','s','ɬ','ʃ','x','ħ','h','v','ð','z','ʒ','ɣ','ʕ','sʔ','sʕ','ɬʔ','ɬʕ','ðʔ','ðʕ'], group: 1, selected: false, title: "(f,θ,s,ɬ,ʃ,x,ħ,h,v,ð,z,ʒ,ɣ,ʕ,sʔ,sʕ,ɬʔ,ɬʕ,ðʔ,ðʕ)"},
			{name: "affricate", letters: ['ʦ','ʧ','ʣ','ʤ'], group: 1, selected: false, title: "(ʦ,ʧ,ʣ,ʤ)"},
			{name: "approximant", letters: ['l','j','w'], group: 1, selected: false, title: "(l,j,w)"},
			{name: "trill", letters: ['r'], group: 2, selected: false, title: "(r)"},
			{name: "emphatic", letters: ['pʔ','pʕ','tʔ','tʕ','kʔ','kʕ','sʔ','sʕ','ɬʔ','ɬʕ','ðʔ','ðʕ','dʔ','dʕ'], group: 2, selected: false, title: "(pʔ,pʕ,tʔ,tʕ,kʔ,kʕ,sʔ,sʕ,ɬʔ,ɬʕ,ðʔ,ðʕ,dʔ,dʕ)"},
			{name: "voiceless", letters: ['p','t','k','ʔ','f','θ','s','ɬ','ʃ','x','ħ','h','ʦ','ʧ'], group: 2, selected: false, title: "(p,t,k,ʔ,f,θ,s,ɬ,ʃ,x,ħ,h,ʦ,ʧ)"},
			{name: "voiced", letters: ['b','d','g','v','ð','z','ʒ','ɣ','ʕ','ʣ','ʤ'], group: 2, selected: false, title: "(b,d,g,v,ð,z,ʒ,ɣ,ʕ,ʣ,ʤ)"},
			{name: "labial", letters: ['m','p','b','f','v','pʔ','pʕ'], group: 2, selected: false, title: "(m,p,b,f,v,pʔ,pʕ)"},
			{name: "dental", letters: ['ð','θ','ðʔ','ðʕ'], group: 2, selected: false, title: "(ð,θ,ðʔ,ðʕ)"},
			{name: "alveolar", letters: ['n','ɲ','t','d','tʔ','tʕ','dʔ','dʕ','s','z','sʔ','sʕ','ʦ','ɬ','ɬʔ','ɬʕ','r'], group: 3, selected: false, title: "(n,ɲ,t,d,tʔ,tʕ,dʔ,dʕ,s,z,sʔ,sʕ,ʦ,ɬ,ɬʔ,ɬʕ,r)"},
			{name: "lateral", letters: ['l','ɬ','ɬʔ','ɬʕ'], group: 3, selected: false, title: "(l,ɬ,ɬʔ,ɬʕ)"},
			{name: "palatal", letters: ['ʃ','ʒ','ʧ','ʤ'], group: 3, selected: false, title: "(ʃ,ʒ,ʧ,ʤ)"},
			{name: "velar/uvular", letters: ['k','g','x','ɣ','w','kʔ','kʕ'], group: 3, selected: false, title: "(k,g,x,ɣ,w,kʔ,kʕ)"},
			{name: "pharyngeal", letters: ['ħ','ʕ'], group: 3, selected: false, title: "(ħ,ʕ)"},
			{name: "glottal", letters: ['ʔ','h'], group: 3, selected: false, title: "(ʔ,h)"},
			{name: "vowel", letters: ['ə','ɒ','ă','ɔ','a','ā','e','ē','i','ī','o','ō','u','ū','ɛ','y','ě','ŏ'], group: 4, selected: false, title: "(ə,ɒ,ă,ɔ,a,ā,e,ē,i,ī,o,ō,u,ū,ɛ,y,ě,ŏ)"},
			{name: "short", letters: ['a','e','i','o','u','ɛ','y','ɒ','ɔ'], group: 4, selected: false, title: "(a,e,i,o,u,ɛ,y,ɒ,ɔ)"},
			{name: "long", letters: ['ā','ē','ī','ō','ū'], group: 4, selected: false, title: "(ā,ē,ī,ō,ū)"},
			{name: "brief", letters: [ 'ŏ','ě','ă','ə'], group: 4, selected: false, title: "( ŏ,ě,ă,ə)"},
			{name: "high", letters: ['i','u','ī','ū','y'], group: 4, selected: false, title: "(i,u,ī,ū,y)"},
			{name: "middle ", letters: ['ə','ě','ŏ','e','o','ɛ','ɔ','ē','ō'], group: 4, selected: false, title: "(ə,ě,ŏ,e,o,ɛ,ɔ,ē,ō)"},
			{name: "low", letters: ['a','ā','ɒ','ă'], group: 4, selected: false, title: "(a,ā,ɒ,ă)"},
			{name: "front", letters: ['ě','i','e','ɛ','ē','ī'], group: 4, selected: false, title: "(ě,i,e,ɛ,ē,ī)"},
			{name: "center", letters: ['ə','ă','a','ɒ','ā'], group: 4, selected: false, title: "(ə,ă,a,ɒ,ā)"},
			{name: "back", letters: ['ŏ','ɔ','o','u','y','ō','ū'], group: 4, selected: false, title: "(ŏ,ɔ,o,u,y,ō,ū)"}
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
				// match.input.click();
				// changeApplyBtn(match.input[0].placeholder);
				bindCheckbox();
			});
		}

		function changeApplyBtn(placeholder){
			// apply[0].innerText = "Apply " + placeholder; ovo sam ja zakomentarisao
		}

		function getInputPos(match){
				match.input.on("click change", function(e){
					element = e.target;
					position = element.selectionStart;
					changeApplyBtn(element.placeholder);
				});
		}

		function applyClass(inputText){
			var type = $(element).data("condition-match");
			scope.condition[type] = $(element).val().insertAtPos(position, 0, inputText);
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

		getInputPos(mOffset);
		// getInputPos(mRe);
		openHelp(mOffset);
		// openHelp(mRe);	
		}, 300);
	}

	return{
		link: linkFunction,
		restrict: 'EA',
		scope: false
	}
});