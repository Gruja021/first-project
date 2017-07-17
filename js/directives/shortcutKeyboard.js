app.directive('shortcutKeyboard', function(shortcutService){
	function linkFunction(scope, elem, attrs){

		var shortcuts = [
			{key: '0', code: 48, letters: ["0"]},
			{key: '1', code: 49, letters: ["1"]},
			{key: '2', code: 50, letters: ["2"]},
			{key: '3', code: 51, letters: ["3"]},
			{key: '4', code: 52, letters: ["4"]},
			{key: '5', code: 53, letters: ["5"]},
			{key: '6', code: 54, letters: ["6"]},
			{key: '7', code: 55, letters: ["7"]},
			{key: '8', code: 56, letters: ["8"]},
			{key: '9', code: 57, letters: ["9"]},
			{key: 'a', code: 65, letters: ["ɑ","æ"]},
			{key: 'b', code: 66, letters: ["b"]},
			{key: 'c', code: 67, letters: ["c","č","ċ"]},
			{key: 'd', code: 68, letters: ["d","ḋ","ḏ","ḍ"]},
			{key: 'e', code: 69, letters: ["e","ə"]},
			{key: 'f', code: 70, letters: ["e","ɛ"]},
			{key: 'g', code: 71, letters: ["g","ǧ"]},
			{key: 'h', code: 72, letters: ["h","ḥ"]},
			{key: 'i', code: 73, letters: ["i","ɪ"]},
			{key: 'j', code: 74, letters: ["j","ǰ"]},//["k"]
			{key: 'k', code: 75, letters: ["k"]},
			{key: 'l', code: 76, letters: ["l"]},
			{key: 'm', code: 77, letters: ["m"]},
			{key: 'n', code: 78, letters: ["n"]},
			{key: 'o', code: 79, letters: ["o","ɔ"]},
			{key: 'p', code: 80, letters: ["p","ṗ"]},
			{key: 'r', code: 82, letters: ["r"]},
			{key: 's', code: 83, letters: ["s","ṡ","ṣ",'š',"ṩ"]},
			{key: 't', code: 84, letters: ["t","ṫ","ṯ","ṭ"]},
			{key: 'u', code: 85, letters: ["u","ʊ"]},
			{key: 'v', code: 86, letters: ["v"]},
			{key: 'w', code: 87, letters: ["w"]},
			{key: 'x', code: 88, letters: ["x"]},
			{key: 'y', code: 89, letters: ["y","ɣ"]},
			{key: 'z', code: 90, letters: ["z","ż","ž","ʔ","ʕ"]},
			{key: 'q', code: 81, letters: ["q"]},
		];
		//'letters' are changing with 'key'+alt
		//'code' is a jquery code for specific 'key'

		String.prototype.replaceAt = function(index, character) {
		    return this.substr(0, index) + character;
		    // + this.substr(index + character.length)
		}

		var altKey;
		var ctrlKey;

		elem.on('keydown', function(e){		
			if(e.which === 18){
				altKey = true;
			}
		});

		elem.on('keyup', function(e){
			if(e.which === 18){
				altKey = false;
				pressCount = 0;
				counter = 0;
			}
		});

		elem.on('keydown', function(e){
			if(e.which === 17){
				ctrlKey = true;
			}
		});

		elem.on('keyup', function(e){
			if(e.which === 17){
				ctrlKey = false;
			}
		});

		var pressCount = 0;
		var timeout = 1000;
		var interval;
		var counter = 0;
		var keysPressed = [];
		

		for(var i = 0; i < shortcuts.length; i++){
			shortKey(shortcuts[i]);
		}
		
		function shortKey(shortcut){			
			var lettersNum = shortcut.letters.length;
			elem.on('keydown', function(e){

			  if(e.which === shortcut.code && altKey){
				e.preventDefault();

			  	if(keysPressed.length && keysPressed[keysPressed.length-1] != shortcut.code){
					pressCount = 0;
			     	counter = 0;
				}

				keysPressed.push(shortcut.code);

			  	var charLength;
				if(counter == 0){
					charLength = shortcut.letters[shortcut.letters.length-1].length;
				}else{
					charLength = shortcut.letters[counter-1].length;
				}

			  	if(pressCount === 0){   
			    	scope.rule.inputWord += shortcut.letters[0];
			    }else{
			    	scope.rule.inputWord = scope.rule.inputWord.replaceAt((scope.rule.inputWord.length - charLength), shortcut.letters[counter]);
			    }

			    pressCount++;
			   
			    clearTimeout(interval);

			    if(counter < (lettersNum - 1)){
			    	counter++;
			    }else{
			    	counter = 0
			    }
         
			   	interval = setTimeout(function(){ 
			      pressCount = 0;
			      counter = 0;
			    }, timeout);

			    scope.$apply();
			  }

			});			
		}


	}

	return{
		link: linkFunction,
		restrict: 'EA',
		scope: false
	}
});