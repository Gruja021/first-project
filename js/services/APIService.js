app.factory('APIService', function(){
	return {
		//serverURL: "http://109.92.182.91:9080/diachronix/",
		//http://138.201.32.208:9080/diachronix/ - Zesium local
		//http://192.168.88.210:9080/diachronix/ - Katarina new local
		//http://www.telekom.ftn.uns.ac.rs/diachronix/ - Telekom
		//http://109.92.182.91:9080/diachronix/ - working server
		// serverURL: "http://192.168.88.210:9080/diachronix/",
		serverURL: "http://109.92.182.91:9080/diachronix/",
		
		headers: {
			timeout: 5000
		},
		errorCallback: function(err){
			var error = true,
				message;
			switch(err.status){
				case -1:
					message = "Server unavailable. Try again later.";
				break;
				case 404:
					message = "Error 404: Service not available.";
				break;
				case 500:
					message = "Error 500: Server can not execute this action.";
				break;
				default:
				message = "Error status: " + err.status;
			}
			return {
				message: message,
				error: error
			};
		}
	}
});
