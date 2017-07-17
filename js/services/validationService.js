app.factory('validationService', function(){
	return {
		validateInput:function(type, value){
			var patt;
			switch(type){
				case 'username':
					patt = /^[a-z0-9]{3,20}$/i;
				break;
				case 'email':
					patt = /^[a-z0-9._-]+@[a-z0-9._-]+[.]{1}[a-z]{2,5}$/i;
				break;
				case 'password':
					patt = /^[a-z0-9]{3,20}$/i;
				break;
			}
			var pattern = new RegExp(patt);
			return pattern.test(value);	//vraca true ili false
		}
	};
});
