app.factory('clientMiddleware', function($state, cookiesService){
	return {
		    allowedStates: ["login", "login.signup", "login.forgot_password"],
            badRequest: "bad_request",
            loginState: "login",
            homeState: "home",
            userDefaultState: 'ROLE_USER',
            adminDefaultState: 'ROLE_ADMIN',
           
            _redirectSomewere: function(e){
              this._doLogOut();
              e.preventDefault();
              $state.go(this.loginState);
              return;
            },

            _doLogOut: function(){
               cookiesService.clearCookies();
            },

            _cookieIsMissing: function(){
                return !this.loggedUser || !this.loggedUserRole;
            },

            _allreadyLooged:function(e){
                if(!this._cookieIsMissing()){
                    e.preventDefault();
                    $state.go(this.homeState);
                } 
            },

            check: function(e, requiredStateName){
                this.loggedUser = cookiesService.getUser()
                this.loggedUserRole = this.loggedUser ? this.loggedUser.role.toLowerCase() : "";

                if(this.allowedStates.indexOf(requiredStateName) != -1){
                    if(requiredStateName == this.loginState){
                        this._allreadyLooged(e);
                        return;
                    }
                    this._allreadyLooged(e);
                    return;
                }

                if(this._cookieIsMissing()){
                    this._redirectSomewere(e);
                    return;
                }
            }
	};
});