var Signin = (function(){
  var _contact = {};
  var _account = {};
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
			case "signin-with-google" :
				//TODO : SignUp With Google
				window.location = window.location.origin+"/oauth/google/authenticate/signin";
				break;
			case "signin-with-facebook" :
				//TODO : SignUp With Facebook
				break;
			case "process-login" :
				//TODO : SignUp With AnywhereWorks
				var isValid = _validateSigninInput();
				if(isValid){
					_disableLoginView(target);
					var parentField = target.parentElement,
					data  = {};
					data.email = parentField.querySelector('#user-email').value;
					data.password = parentField.querySelector('#user-password').value;
                    target.innerHTML = "Logging...";
					Service.signin(data).done(function(response){

						if(response && response.data){
                          console.info("Successfully account created");
                          var accountType = response.data.accountType;
                          switch(accountType){

                            case "CUSTOMER" :
                                window.location.href = "/";
                                break;
                            case "BUSINESS" :
                                window.location.href = "/business";
                                break;
                            case "KISSAN" :
                                window.location.href = "/kissan";
                                break;
                            default:
                                window.location.href = "/";
                                break;
                          }
                        }
					}).fail(function(err){
						if((parentField = parentField.querySelector('#error-message'))) {
							parentField.innerHTML = err.error;
							parentField.style.display = 'block';
						}
						target.innerHTML = "Login";
                        _enableLoginView(target);
					});
				}
				break;
			case "remember-me" :
				//TODO : Handle remember me implementation
				if(target.classList.contains("uncheck")){
					target.classList.add("check");
					target.classList.remove("uncheck");
				}else{
					target.classList.add("uncheck");
					target.classList.remove("check");
				}
				break;
			case "process-forgot-password" :
				//TODO : Handle forgot password implementation
				//showForgotPwdSection();
				break;

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
        var loginInputGroupEle = document.getElementById("signin-input-group");
        if(loginInputGroupEle){
            loginInputGroupEle.classList.remove("aw-disabled");
            $(loginInputGroupEle).find("input")[1].value = "";
            $(loginInputGroupEle).find("input")[1].focus();
        }
        var signInGoogleBtn = document.getElementById("signin-with-google");
        if(signInGoogleBtn)
            signInGoogleBtn.removeAttribute("disabled","disabled");
        var signInFacebookBtn = document.getElementById("signin-with-facebook");
        if(signInFacebookBtn)
            signInFacebookBtn.removeAttribute("disabled","disabled");
    }catch(err){
        console.warn(err.stack);
    }
  };
$('#show-password').click(function(){

   if($('#user-password').attr('type')==='text'){
        document.getElementById("show-password").innerHTML="Show";
         $('#user-password').attr('type','password');
   }else{
     $('#user-password').attr('type','text');
     document.getElementById("show-password").innerHTML="Hide";
   }
   });
  var _disableLoginView = function(target){
	  if(!target)
		  return;
	  try{
		  	target.classList.add("processing");
			target.setAttribute("disabled","disabled");
			var loginInputGroupEle = document.getElementById("signin-input-group");
			if(loginInputGroupEle)
				loginInputGroupEle.classList.add("aw-disabled");

			var signInGoogleBtn = document.getElementById("signin-with-google");
			if(signInGoogleBtn)
				signInGoogleBtn.setAttribute("disabled","disabled");
			var signInFacebookBtn = document.getElementById("signin-with-facebook");
			if(signInFacebookBtn)
				signInFacebookBtn.setAttribute("disabled","disabled");
	  }catch(err){
		  console.error("Error in _disableLoginView",err);
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
  };

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

  var _validateSigninInput = function(){
	  try{
		  var isValid = true;
		  var signinInputGroup = document.getElementById("signin-input-group"),
		  userEmailEle = signinInputGroup.querySelector("#user-email"),
		  userPasswordEle = signinInputGroup.querySelector("#user-password");
		  var errorMessageEle = document.getElementById("error-message");
		  _hideAllErrorMessage(signinInputGroup);
		  $(signinInputGroup).find("input").removeClass("error");
		  if(Validator.isEmpty(userEmailEle.value.trim()) && (Validator.isEmpty(userPasswordEle.value.trim()) || !Validator.isValidPattern("password",userPasswordEle.value.trim()))){
			  _invalidateWithCommonMessage(errorMessageEle,"Oops, We need an email address and password to get login");
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
              isValid = false;
          }
		  return isValid;
	  }catch(err){
		  console.error("Error in _validateSignupInput",err);
	  }
  };
  var _signinInputKeyUpHandler = function(event){
	  try{
		 var target = event.target;
		 switch(target.id){
		 	case "user-email" :
		 	case "mail-reset-password" :
		 		if(!Validator.isEmpty(target.value.trim()) && Validator.isValidEmail(target.value.trim())){
		 			_validateInput(target);
				}
		 		if(event.keyCode == 13 && target.id == "mail-reset-password"){
		 			forgotPasswordHandler();
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

  let handleExpiredMsg = function(view){

	 var expiryMsgEle = document.getElementById('expired-mail-link');
	if(view == "show"){
		expiryMsgEle.style.display = "block";
	}else{
		expiryMsgEle.style.display = "none";
	}
  };

  let showForgotPwdSection = function(isExpired){

	  let loginWrapper = document.querySelector('.aw-login-wrapper');
		if(loginWrapper){
			loginWrapper.classList.add('aw-reset-pwd');
			_bindForgotPwdEvents();
		}

		if(isExpired){
			handleExpiredMsg("show");
		}else{
			handleExpiredMsg("hide");
		}
  };

  let _bindForgotPwdEvents = function(){

		var resetPasswordBtn = document.getElementById('resetPassword');
		resetPasswordBtn.addEventListener('click',forgotPasswordHandler);

		var emailInputBox = document.getElementById('mail-reset-password');
		emailInputBox.focus();
		emailInputBox.addEventListener('keyup',_signinInputKeyUpHandler)
		var loginBtn = document.getElementById('loadLogin');
		if(loginBtn) {
			loginBtn.addEventListener('click',onLoginViewClicked);
		}
  }

  let _unbindForgotPwdEvents = function(target) {
	var resetPasswordBtn = document.getElementById('resetPassword');
	resetPasswordBtn.removeEventListener('click',forgotPasswordHandler);

	var emailInputBox = document.getElementById('mail-reset-password');
	emailInputBox.removeEventListener('keyup',_signinInputKeyUpHandler)
	target.removeEventListener('click',onLoginViewClicked);
  }

  let onLoginViewClicked = function(event) {
	  let loginWrapper = document.querySelector('.aw-login-wrapper');
	  if(loginWrapper){
			$(loginWrapper).removeClass("aw-reset-pwd");
	  }
	  _unbindForgotPwdEvents(event.target);
	  var errorMessageEle = document.getElementById("error-message");
	  if(errorMessageEle)
        errorMessageEle.style.display = "none";
  }

  var forgotPasswordHandler = function(event){

	  let emailField = document.querySelector('#mail-reset-password');
	  let emailId = emailField.value;
	  let invalidEmailMsg = document.getElementById('resent-pwd-mail');
	  handleExpiredMsg("hide");
	  if(!emailId || !Validator.isValidEmail(emailId)){
		  emailField.classList.add('error');
		  invalidEmailMsg.textContent = "Email doesn't looks good.";
		  invalidEmailMsg.style.display = "block";
		  return;
	  }
	  var resetBtn = document.getElementById('resetPassword');
	  resetBtn.setAttribute("disabled",true);
	  resetBtn.classList.add('processing');
	  let loginWrapper = document.querySelector('.aw-login-wrapper');

	  Service.requestResetPassword(emailId).done(function(data){

		  if(data.ok){
			  invalidEmailMsg.style.display = "none";
			  if(loginWrapper){
				  loginWrapper.className = "aw-login-wrapper";
				  loginWrapper.classList.add('aw-reset-success');
			  }
		  }else{
			  invalidEmailMsg.textContent = "Email is not registered with Anywhereworks.";
			  invalidEmailMsg.style.display = "block";
			  resetBtn.classList.remove('processing');
			  resetBtn.removeAttribute("disabled");
		  }
		  resetBtn.removeAttribute("disabled");
	  }).fail(function(err){

		  let errorMsg = document.getElementById('resent-pwd-mail');
		  errorMsg.textContent = "Oops, something went wrong";
		  errorMsg.style.display = "block";
		  resetBtn.classList.remove('processing');
		  resetBtn.removeAttribute("disabled");
	  });
  };
  var _handleKeyPressEvent  = function(event){
	    event.stopPropagation();

	    try{
	      if(event.keyCode === 13){
	        var createAccountBtn = document.getElementById("process-login");
	        createAccountBtn.click();
	      }
	    }catch(err){
	      console.warn(err.stack);
	    }
  };

  var _getQueryParam = function(queryKey){

		try{
		    var query = window.location.search.substring(1);
            var parms = query.split('&');
            for (var i=0; i<parms.length; i++) {
                var pos = parms[i].indexOf('=');
                if (pos > 0  && queryKey == parms[i].substring(0,pos)) {
                    return parms[i].substring(pos+1);;
                }
            }
		}catch(err){
		    console.error("Error in _getQueryParam",err);
		}
		return "";
  };

  var _getQueryParamFromEncodedUrl = function(queryKey){

        try{
            var query = window.location.search.substring(1);
            var parms = query.split('%26');
            for (var i=0; i<parms.length; i++) {
                var pos = parms[i].indexOf('%3D');
                if (pos > 0  && queryKey == parms[i].substring(0,pos)) {
                    return parms[i].substring(pos+3);;
                }
            }
        }catch(err){
            console.error("Error in _getQueryParamFromEncodedUrl",err);
        }
        return ""
  };



  var _init = function(){
    try{
//    	let isExpired = _getQueryParam("err");
//    	if(isExpired){
//    		showForgotPwdSection(isExpired);
//    	}
    	var signinForm = document.getElementById("signin-form-container");
    	signinForm.addEventListener("click",_clickHandler);
    	var user_login_Element = signinForm.querySelector("#user-email");
    	user_login_Element.focus();
    	var signinInputGroup = signinForm.querySelector("#signin-input-group");
    	signinInputGroup.addEventListener("input",_signinInputKeyUpHandler);
    	$(signinInputGroup).on('keypress',"input",_handleKeyPressEvent);
    }catch(err){
      console.warn(err.stack);
    }
  };

  return {
    init : _init
  };
})();

Signin.init();