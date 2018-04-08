
var Service = (function(){

    var _getQueryParam = function(queryKey){

        var query = window.location.search.substring(1);
        var parms = query.split('&');
        for (var i=0; i<parms.length; i++) {
            var pos = parms[i].indexOf('=');
            if (pos > 0  && queryKey == parms[i].substring(0,pos)) {
                return parms[i].substring(pos+1);;
            }
        }
        return "";
    };

    let _processAccount = function(dataObj){
          var deferred = $.Deferred();
          if(!dataObj){
              return deferred.reject({'error':'Cannot process empty request.'});
          }
          try{
              Model.makeAjaxRequest(dataObj).done(function(data){
                  deferred.resolve(data);
              }).fail(function(error){
                  deferred.reject(error);
              });
          }catch(err){
              console.error("Error in _createLead",err);
              deferred.reject(err);
          }
          return deferred.promise();
    };

    let _createAccount = function(dataObj){
        var deferred = $.Deferred();
            if(!dataObj){
              return deferred.reject({'error':'invalid request'});
            }
            try{
              Model.makeAjaxRequest({
                'url' : "/signup/account/create",
                'data': JSON.stringify(dataObj),
                'type': "POST",
                'contentType' :"application/json"
              }).done(function(data){
                deferred.resolve(data);
              }).fail(function(error){

                deferred.reject({'error':error});

              });

            }catch(err){
              deferred.reject({'error':'not able to process'});
            }
            return deferred.promise();
    };

    var _signin = function(dataObj) {

        var deferred = $.Deferred();
        if(!dataObj.email || !dataObj.password) {
            return deferred.reject({'error':'Invalid data'});
        }

        try{
            Model.makeAjaxRequest({
                'url' : '/signin',
                'type' : 'POST',
                'data' : JSON.stringify(dataObj),
                'contentType' 	: "application/json"
            }).done(function(data) {
                if(data) {
                    if(!data.ok) {
                        deferred.reject({'error' : 'Invalid login credentials'});
                    } else {
                        deferred.resolve(data);
                    }
                }
            }).fail(function(error) {
                deferred.reject({'error' : 'Not able to process'});
            })
        } catch(err) {
            deferred.reject({'error' : 'Not able to process'});
        }
        return deferred.promise();
    };

    return {
        'getQueryParam'  : _getQueryParam,
        'processAccount' : _processAccount,
        'createAccount'  : _createAccount,
        'signin'         : _signin
     };

})();