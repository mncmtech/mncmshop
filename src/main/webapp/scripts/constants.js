var Constants = (function(constants) {


		var apiServer		= "";

		if((location.host.indexOf('staging')!=-1 ||  location.host.indexOf('localhost')!=-1 || location.host.indexOf('fullspectrum:')!=-1)){
			apiServer = 'https://staging-dot-mncm-196208.appspot.com';
		}else{
			apiServer = 'https://mncm-196208.appspot.com';
		}

		Object.defineProperties(constants, {

			API_SERVER : {
				value : apiServer
			},
			API_URL : {
				value : apiServer+"/api/v1/"
			}
		});

		var _init = function() {
			Object.freeze(constants);
		}();

		return constants;

	}({}));