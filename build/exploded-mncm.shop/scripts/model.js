
(function addXhrProgressEvent($) {
    var originalXhr = $.ajaxSettings.xhr;
    $.ajaxSetup({
        xhr: function() {
            var req = originalXhr(),
                that = this;
            if (req) {
                if (typeof req.addEventListener == "function" && that.progress !== undefined) {
                    req.addEventListener("progress", function(evt) {
                        that.progress(evt);
                    }, false);
                }
                if (typeof req.upload == "object" && that.progressUpload !== undefined) {
                    req.upload.addEventListener("progress", function(evt) {
                        that.progressUpload(evt);
                    }, false);
                }
            }
            return req;
        }
    });
})(jQuery);

;(function($, window, document,undefined) {

	var Model = (function() {

		var makeAjaxRequest = function(request) {

			try {
				var ajaxOptions = {
					'type' 		 : request.type,
					'url'		 : request.url,
					'data'		 : request.data,
					'contentType': request.contentType,
					'dataType' 	 : request.dataType
				};

				if(request.headers) {
					ajaxOptions.beforeSend = function(xhr) {
						for(var key in request.headers)
							xhr.setRequestHeader(key, request.headers[key]);
					}
				}

				if(request.headers) {
					ajaxOptions.headers = request.headers;
				}


				return $.ajax(ajaxOptions);

			} catch (err) {
				console.error("Error at makeAjaxRequest ", err);
			}

		};

		var makeAjaxFormRequest = function(request) {

            try {
                var ajaxOptions = {
                    'url' : request.url,
                    'data' : request.data,
                    'processData' : request.processData,
                    'contentType' : request.contentType,
                    'type' : request.type
                };

                return $.ajax(ajaxOptions);

            } catch (err) {
                console.error("Error at makeAjaxFormRequest ", err);
            }

        };


		var processJsonPRequest = function(request) {

			var requestObj = {
				type 		: "GET",
				url 		: request.url,
				contentType : 'application/json;charset=utf-8',
				data 		: request.data,
				dataType	: 'jsonp',
				crossDomain : true,
				timeout 	: 30000
			};
			if(request.jsonp && request.jsonp === "callback"){
				requestObj.jsonp = request.jsonp;
			}else{
				requestObj.jsonpCallback = "jsoncallback";
			}
			
			return $.ajax(requestObj);

		};

		var processFormRequest = function(request) {

			return $.ajax({
				url			: request.blobUrl,
				type		: 'POST',
				cache		: false,
				data		: request.param,
				processData : request.processData,
				contentType : false,
				progressUpload : request.progressUpload
			});
		};

		return {
			makeAjaxRequest: makeAjaxRequest,
			processJsonPRequest: processJsonPRequest,
			processFormRequest : processFormRequest,
			makeAjaxFormRequest : makeAjaxFormRequest
		}


	})();

	window.Model = Model;

})(jQuery, window, document || {});
