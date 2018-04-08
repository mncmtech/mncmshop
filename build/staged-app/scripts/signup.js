var Signup = (function(){
  var disableLoginBox = true;
  var TYPE = "CUSTOMER";
  var email_RegExp    = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  /**
   * [Validator utility function.]
   */
  var Validator = (function(){
    var pattern = {
      "password" : "(?=.{6,})",
      "name"     : "^[a-zA-Z ]{2,30}",
    };

    var isEmpty = function(val){
      try{
        if(val){
          if(typeof val === "string")
            val = val.trim();
        }
        return (!val || !val.length) ? true : false;
      }catch(err){
        console.warn(err.stack);
      }
    };

    var isValidPattern = function(type, val){
      if(!type || !val || !pattern[type]){
        return false;
      }
      try{
        return new RegExp(pattern[type]).test(val.trim());
      }catch(err){
        console.warn(err.stack);
      }
    };
    var isValidEmailAddress = function(email) {
        var email = email ? email.toLowerCase() : email;
        return email_RegExp.test(email);
    };

    return {
      isEmpty : isEmpty,
      isValidPattern : isValidPattern,
      isValidEmail : isValidEmailAddress
    };
  })();
  var _clickHandler = function(event){
	try{
		var target  = event.target;
		switch(target.id){
			case "signup-with-google" :
				window.location = window.location.origin+"/oauth/google/authenticate/signup?type="+TYPE;
				break;
			case "create-account" :
				var isValid = _validateSignupInput();
				if(isValid){
					_disableLoginView(target);
					_processAccount(target);
				}
				break;
			case "business-type" :
			    target.nextElementSibling.style.display = "block";
			    break;
		}

		if(target.nodeName === "LI" || target.nodeName === "SPAN"){

            var type = "BUSINESS";
            if(target.nodeName === "SPAN"){
                type = target.innerHTML.toUpperCase();
		        target = target.parentElement;
		    }else{
		        var span = target.querySelector("span");
		        type = span.innerHTML.toUpperCase();
		    }
		    target.parentElement.parentElement.style.display = "none";
		    target.parentElement.parentElement.previousElementSibling.value = type;
		}
	}catch(err){
		console.error("Error in _clickHandler",err);
	}
  };

  var _enableLoginView = function(target){
    if(!target){
        return;
    }
    try{
        target.classList.remove("processing");
        target.removeAttribute("disabled");
        var loginInputGroupEle = document.getElementById("signup-input-group");
        if(loginInputGroupEle){
            loginInputGroupEle.classList.remove("aw-disabled");
            $(loginInputGroupEle).find("input").val("");
            $(loginInputGroupEle).find("input")[0].focus();
        }
        var signInGoogleBtn = document.getElementById("signup-with-google");
        if(signInGoogleBtn)
            signInGoogleBtn.removeAttribute("disabled","disabled");
        var signInFacebookBtn = document.getElementById("signup-with-facebook");
        if(signInFacebookBtn)
            signInFacebookBtn.removeAttribute("disabled","disabled");
    }catch(err){
        console.warn(err.stack);
    }
  };

  var _disableLoginView = function(target){
	  if(!target)
		  return;
	  try{
		  	target.classList.add("processing");
			target.setAttribute("disabled","disabled");
			var loginInputGroupEle = document.getElementById("signup-input-group");
			if(loginInputGroupEle)
				loginInputGroupEle.classList.add("aw-disabled");

			var signInGoogleBtn = document.getElementById("signup-with-google");
			if(signInGoogleBtn)
				signInGoogleBtn.setAttribute("disabled","disabled");
			var signInFacebookBtn = document.getElementById("signup-with-facebook");
			if(signInFacebookBtn)
				signInFacebookBtn.setAttribute("disabled","disabled");
	  }catch(err){
		  console.error("Error in _disableLoginView",err);
	  }
  };

  var _getBrowserInformation = function(){
		try{
			   var browserDetails = navigator.userAgent,
	           user  =   browserDetails.toLowerCase(),
	           browser = "";
	            if (user.indexOf("msie") != -1){
	                var substring = browserDetails.substring(browserDetails.indexOf("MSIE")).split(";")[0];
	                browser=substring.split(" ")[0].replace("MSIE", "IE")+"-"+substring.split(" ")[1];
	            }else if (user.indexOf("safari") != -1 && user.indexOf("version") != -1){
	                browser=(browserDetails.substring(browserDetails.indexOf("Safari")).split(" ")[0]).split("/")[0]+"-"+(browserDetails.substring(browserDetails.indexOf("Version")).split(" ")[0]).split("/")[1];
	            }else if ( user.indexOf("opr") != -1 || user.indexOf("opera") != -1){
	                if(user.indexOf("opera") != -1)
	                    browser=(browserDetails.substring(browserDetails.indexOf("Opera")).split(" ")[0]).split("/")[0]+"-"+(browserDetails.substring(browserDetails.indexOf("Version")).split(" ")[0]).split("/")[1];
	                else if(user.indexOf("opr") != -1)
	                    browser=((browserDetails.substring(browserDetails.indexOf("OPR")).split(" ")[0]).replace("/", "-")).replace("OPR", "Opera");
	            }else if (user.indexOf("chrome") != -1){
	                browser=(browserDetails.substring(browserDetails.indexOf("Chrome")).split(" ")[0]).replace("/", "-");
	            }else if ((user.indexOf("mozilla/7.0") > -1) || (user.indexOf("netscape6") != -1)  || (user.indexOf("mozilla/4.7") != -1) || (user.indexOf("mozilla/4.78") != -1) || (user.indexOf("mozilla/4.08") != -1) || (user.indexOf("mozilla/3") != -1) ){
	                browser = "Netscape-?";
	            }else if (user.indexOf("firefox") != -1){
	                browser=(browserDetails.substring(browserDetails.indexOf("Firefox")).split(" ")[0]).replace("/", "-");
	            }else if(user.indexOf("rv") != -1){
	                browser="IE-" + user.substring(user.indexOf("rv") + 3, user.indexOf(")"));
	            }else{
	                browser = "UnKnown";
	            }
	            return browser;
		}catch(err){
			console.error("Error in _getBrowserInformation",err);
		}
		return null;
	};

	var _getOSInformation = function(){
		try{
			   var browserDetails = navigator.userAgent,
	           user  =   browserDetails.toLowerCase(),
	           os = "";
	           if (browserDetails.toLowerCase().indexOf("windows") >= 0 ){
	                os = "Windows";
	            }else if(browserDetails.toLowerCase().indexOf("mac") >= 0){
	                os = "Mac";
	            }else if(browserDetails.toLowerCase().indexOf("x11") >= 0){
	                os = "Unix";
	            }else if(browserDetails.toLowerCase().indexOf("android") >= 0){
	                os = "Android";
	            }else if(browserDetails.toLowerCase().indexOf("iphone") >= 0){
	                os = "IPhone";
	            }else{
	                os = "UnKnown";
	            }
	            return os;
		}catch(err){
			console.error("Error in _getBrowserInformation",err);
		}
		return null;
	};

  var _processAccount = function(target){
	  try{
		  var signupInputGroup = document.getElementById("signup-input-group");
		  var userEmailInput = signupInputGroup.querySelector("#user-email");
		  var userPasswordInput = signupInputGroup.querySelector("#user-password");
		  var errorMessageEle = document.getElementById("error-message");
		  errorMessageEle.style.display = "none";
		  var email = userEmailInput.value.trim();
		  var password = userPasswordInput.value.trim();

		  var data = {
		     'login'    : email,
		     'password' : password,
		     'type'     : TYPE
		  };

		  Cookie.create("signup",email+":"+password+":"+TYPE,7);

		  window.location.href="/onboard?info="+email+":no-name"+":"+TYPE;

//          var headerObject = {
//			'X-OS-FOR' 		  : _getOSInformation(),
//			'X-BROWSER-FOR'   : _getBrowserInformation()
//		  };
//		  var requestObj = {
//            'url' 			    : "/signup/account/process",
//            'data'			    : JSON.stringify(data),
//            'type'			    : "POST",
//            'contentType' 	    : "application/json",
//            'headers'     	    : headerObject
//		  };
//          Service.processAccount(requestObj).done(function(response){
//
//              if(!response.ok){
//                    var msg = "We are not able to process your request, Please Try Again!";
//                    if(response.errors && response.errors[0].message === "contact already exist")
//                        msg = "You have already registered, Please Login!";
//                  errorMessageEle.innerHTML = msg;
//                  errorMessageEle.style.display = "block";
//                  _enableLoginView(target);
//                  return;
//              }
//          }).fail(function(error){
//              var errorResponse = JSON.parse(error.responseText);
//              errorMessageEle.innerHTML = msg;
//              errorMessageEle.style.display = "block";
//              _enableLoginView(target);
//              Cookie.erase("signup");
//          });
      }catch(err){
        console.error("Error  in _processAccount",err);
        _enableLoginView(target);
        Cookie.erase("signup");
      }
  };

  var _invalidateWithCommonMessage = function(errorMessageEle,msg){
	  if(!errorMessageEle || !msg)
		  return;
	  try{
		  errorMessageEle.innerHTML = msg;
		  errorMessageEle.style.display = "block";
	  }catch(err){
		  console.error("Error in _invalidateWithCommonMessage",err);
	  }
  };

  var _validateSignupInput = function(){
	  try{
		  var isValid = true;
		  var signupInputGroup = document.getElementById("signup-input-group"),
		  userEmailEle = signupInputGroup.querySelector("#user-email"),
		  userPasswordEle = signupInputGroup.querySelector("#user-password");
		  var errorMessageEle = document.getElementById("error-message");
		  _hideAllErrorMessage(signupInputGroup);

		  if(Validator.isEmpty(userEmailEle.value.trim()) && (Validator.isEmpty(userPasswordEle.value.trim()) || !Validator.isValidPattern("password",userPasswordEle.value.trim()))){
			  _invalidateWithCommonMessage(errorMessageEle,"Oops, We need an email address and password to get started");
			  return false;
		  }
		  if(!Validator.isValidEmail(userEmailEle.value.trim()) && (Validator.isEmpty(userPasswordEle.value.trim()) || !Validator.isValidPattern("password",userPasswordEle.value.trim()))){
			  _invalidateWithCommonMessage(errorMessageEle,"Oops, Your email address and password doesn't look right");
			  return false;
		  }
		  if(Validator.isEmpty(userEmailEle.value.trim())){
			  _invalidateInput(userEmailEle,"Email can't be empty");
			  userEmailEle.focus();
			  return false;
		  }
		  if(!Validator.isValidEmail(userEmailEle.value.trim())){
			  _invalidateInput(userEmailEle,"Oops, Email doesn't look right");
			  userEmailEle.focus();
			  return false;
		  }
		  if(Validator.isEmpty(userPasswordEle.value.trim())){
			  _invalidateInput(userPasswordEle,"Password can't be empty");
			  userPasswordEle.focus();
			  return false;
		  }

		  if(!Validator.isValidPattern("password",userPasswordEle.value.trim())){
			  _invalidateInput(userPasswordEle,"Oops, Password doesn't look right");
			  userPasswordEle.focus();
			  return false;
		  }

		  if(!Validator.isValidPattern("password",userPasswordEle.value.trim())){
              _invalidateInput(userPasswordEle,"Oops, Password doesn't look right");
              userPasswordEle.focus();
              isValid = false;
          }
		  return isValid;
	  }catch(err){
		  console.error("Error in _validateSignupInput",err);
	  }
  };

  var _hideAllErrorMessage = function(_feildSet){
          try{
              if(!_feildSet)
                return;

              $(_feildSet).find("p").hide();
              $(_feildSet).find("input").removeClass("error");
          }catch(err){
              console.error("Error in _hideAllErrorMessage",err);
          }
    };


    var _invalidateInput = function(input, msg){
      if(!input || !msg){
        return;
      }
      try{
        input.classList.add("error");
            if(input.id === "user-password")
              $(input.parentElement.parentElement).find("p").html(msg).show();
            $(input.parentElement).find("p").html(msg).show();

      }catch(err){
        console.warn(err.stack);
      }
    }

    var _validateInput = function(input){
      if(!input){
        return;
      }
      try{
        input.classList.remove("error");
            if(input.id === "user-password")
              $(input.parentElement.parentElement).find("p").hide();
            $(input.parentElement).find("p").hide();

            var commonErrorMsgEle = document.getElementById("error-message");
            if(commonErrorMsgEle)
              commonErrorMsgEle.style.display = "none";

      }catch(err){
        console.warn(err.stack);
      }
    }

  var _signupInputKeyUpHandler = function(event){
	  try{
		 var target = event.target;
		 switch(target.id){
		 	case "user-email" :
		 		if(!Validator.isEmpty(target.value.trim()) && Validator.isValidEmail(target.value.trim())){
		 			_validateInput(target)
				}
		 		break;
		 	case "user-password" :
		 		if(!Validator.isEmpty(target.value.trim()) && Validator.isValidPattern("password",target.value.trim())){
		 			_validateInput(target);
				  }
		 		break;
		 }
	  }catch(err){
		  console.error("Error in _signupInputKeyUpHandler",err);
	  }
  };

  var _handleKeyPressEvent  = function(event){
	    event.stopPropagation();

	    try{
	      if(event.keyCode === 13){
	        var createAccountBtn = document.getElementById("create-account");
	        createAccountBtn.click();
	      }
	    }catch(err){
	      console.warn(err.stack);
	    }
  };

  var _getSignupType = function(){
    try{

        if(window.location.pathname.indexOf("business_signup") != -1){
            TYPE = "BUSINESS";
            var createAccountBtn = document.getElementById("business-type");
            if(createAccountBtn)
                createAccountBtn.value=TYPE;
        }
    }catch(err){
        console.error("Error in _getSignupType",err);
    }
  };

  var _init = function(){
    try{
        _getSignupType();
    	var signupForm = document.getElementById("signup-form-container");
    	signupForm.addEventListener("click",_clickHandler);
    	var user_name_Element = signupForm.querySelector("#user-email");
    	user_name_Element.focus();
    	var signupInputGroup = signupForm.querySelector("#signup-input-group");
    	signupInputGroup.addEventListener("input",_signupInputKeyUpHandler);
    	$(signupInputGroup).on('keypress',"input",_handleKeyPressEvent);

    }catch(err){
      console.warn(err.stack);
    }
  };

  return {
    init : _init
  };
})();

Signup.init();