
var Onboard = (function(){

var TYPE = "CUSTOMER";
var CONTACT = {};
var ACCOUNT = {};
var CONTACT_METHOD_TYPE = {"email":"EMAIL","phone":"PHONE","mobile":"MOBILE"};
var ACCOUNT_CONTAINER = document.getElementById("account-form-container");
var ACCOUNT_ADDRESS_CONTAINER = document.getElementById("acc-address-form-container");
var PROFILE_CONTAINER = document.getElementById("profile-container");
var ACCOUNT_REQUEST_OBJ = {};
var CONTACT_REQUEST_OBJ = {};

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

  var _accountClickHandler = function(event){
  	try{
  		var target  = event.target;
  		if(target.id === "process-account"){
           _processAccount();
  		}
  	}catch(err){
  		console.error("Error in _clickHandler",err);
  	}
  };

  var _addressClickHandler = function(event){
    try{
        var target  = event.target;
        if(target.id === "process-acc-address"){
           _process_acc_Address();
        }
    }catch(err){
        console.error("Error in _clickHandler",err);
    }
  };

  var _profileClickHandler = function(event){
      try{
          var target  = event.target;
          if(target.id === "create-account"){
            _createAccount(target);
          }
      }catch(err){
          console.error("Error in _clickHandler",err);
      }
  };

  var _processAccount = function(){
    try{
        var acc_nameEle  = ACCOUNT_CONTAINER.querySelector("#account-name");
        var acc_typeEle  = ACCOUNT_CONTAINER.querySelector("#account-type");
        var acc_emailEle = ACCOUNT_CONTAINER.querySelector("#account-email");
        var acc_phoneEle = ACCOUNT_CONTAINER.querySelector("#account-phone");
        var acc_contact_methods = [];
        if(acc_typeEle.value.trim() != TYPE){
            acc_typeEle.nextElementSibling.style.display = "block";
            acc_typeEle.innerText = "Business type is not valid";
            return;
        }
        ACCOUNT['name'] = acc_nameEle.value.trim();
        ACCOUNT['type'] = acc_typeEle.value.trim();

        var email = acc_emailEle.value.trim();
        var phone = acc_phoneEle.value.trim();

        ACCOUNT_REQUEST_OBJ['accountModel'] = ACCOUNT;

        var contactMethod = _createContactMethod(CONTACT_METHOD_TYPE.email,email,"account",true);
        acc_contact_methods.push(contactMethod);
        contactMethod = _createContactMethod(CONTACT_METHOD_TYPE.phone,phone,"account",true);
        acc_contact_methods.push(contactMethod);

        ACCOUNT_REQUEST_OBJ['linkedContactMethods'] = acc_contact_methods;

        _toggleView(ACCOUNT_CONTAINER,"none");
        _toggleView(ACCOUNT_ADDRESS_CONTAINER,"block");

    }catch(err){
        console.error("Error in _processAccount",err);
    }
  };

  var _process_acc_Address = function(){
      try{

        var addr_number  = ACCOUNT_ADDRESS_CONTAINER.querySelector("#acc-address-number");
        var addr_street  = ACCOUNT_ADDRESS_CONTAINER.querySelector("#acc-address-street");
        var addr_city  = ACCOUNT_ADDRESS_CONTAINER.querySelector("#acc-address-city");
        var addr_region = ACCOUNT_ADDRESS_CONTAINER.querySelector("#acc-address-region");
        var addr_code = ACCOUNT_ADDRESS_CONTAINER.querySelector("#acc-address-pincode");
        var addr_type = ACCOUNT_ADDRESS_CONTAINER.querySelector("#acc-address-type");
        var addr_country = ACCOUNT_ADDRESS_CONTAINER.querySelector("#acc-address-country");

        var address_list = [];

        var address = {
            'homeNumber' : addr_number.value.trim(),
            'street'     : addr_street.value.trim(),
            'city'       : addr_city.value.trim(),
            'region'     : addr_region.value.trim(),
            'country'    : addr_country.value.trim(),
            'type'       : addr_type.value.trim(),
            'pincode'    : addr_code.value.trim(),
            'primary'    : true
        };

        address_list.push(address);

        ACCOUNT_REQUEST_OBJ['linkedAddresses'] = address_list;

        _toggleView(ACCOUNT_ADDRESS_CONTAINER,"none");
        _toggleView(PROFILE_CONTAINER,"block");

      }catch(err){
          console.error("Error in _processAccount",err);
      }
  };

  var _createAccount = function(target){
    try{

        var user_first_name     = PROFILE_CONTAINER.querySelector("#user-first-name");
        var user_last_name      = PROFILE_CONTAINER.querySelector("#user-last-name");
        var user_mobile_number  = PROFILE_CONTAINER.querySelector("#user-mobile-number");

        CONTACT.firstName = user_first_name.value.trim();
        CONTACT.lastName  = user_last_name.value.trim();

        var mobile_number = user_mobile_number.value.trim();
        var parentField = target.parentElement;

        var acc_contact_methods = [];
        var contactMethod = _createContactMethod(CONTACT_METHOD_TYPE.email,CONTACT.login,"contact",true);
        acc_contact_methods.push(contactMethod);
        contactMethod = _createContactMethod(CONTACT_METHOD_TYPE.phone,mobile_number,"contact",true);
        acc_contact_methods.push(contactMethod);

        CONTACT_REQUEST_OBJ['contactModel'] = CONTACT;
        CONTACT_REQUEST_OBJ['linkedContactMethods'] = acc_contact_methods;

        if(Object.keys(ACCOUNT_REQUEST_OBJ).length === 0 || TYPE === "CUSTOMER"){
            ACCOUNT.type = TYPE;
            ACCOUNT.name = CONTACT.firstName;
           ACCOUNT_REQUEST_OBJ['accountModel'] = ACCOUNT;
        }

        var request_obj = {
            'contact' : CONTACT_REQUEST_OBJ,
            'account' : ACCOUNT_REQUEST_OBJ
        }
        target.innerHTML = "Creating Account...";
        Service.createAccount(request_obj).done(function(response){
          if(response && response.data){
              console.info("Successfully account created");
              Cookie.erase("signup");
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
          }else{
            if(!response.ok){
                var msg = "We are not able to process your request, Please Try Again!";
                if(response.errors && response.errors[0].message === "contact already exist")
                    msg = "You have already registered, Please Login!";
                if((parentField = parentField.querySelector('#user-error-messagee'))) {
                    parentField.innerHTML = err.error;
                    parentField.style.display = 'block';
                }
                target.innerHTML = "Create Account";
                return;
            }
          }

        }).fail(function(){
            console.info("Account Creation Failed");
        });

    }catch(err){
        console.error("Error in _processAccount",err);
    }
  };

  var _createContactMethod = function(type,value,key,isPrimary){

    if(!type || !value)
        return;

    try{
        return {
            'key'       : key ? key : "",
            'type'      : type,
            'value'     : value,
            'primary'   : isPrimary ? isPrimary : false
        };
    }catch(err){
        console.error("Error in _createContactMethod",err);
    }
  };

  var _toggleView = function(target,visibility){
      if(!target)
        return;
      try{
        target.style.display = visibility;
      }catch(err){
          console.error("Error in _toggleView",err);
      }
  };

  var _bindEvents = function(){
    try{
        if(TYPE === "BUSINESS"){
            if(ACCOUNT_CONTAINER)
                ACCOUNT_CONTAINER.addEventListener("click",_accountClickHandler);
            if(ACCOUNT_ADDRESS_CONTAINER)
                ACCOUNT_ADDRESS_CONTAINER.addEventListener("click",_addressClickHandler);
        }
        if(PROFILE_CONTAINER)
            PROFILE_CONTAINER.addEventListener("click",_profileClickHandler);

    }catch(err){
      console.error("Error in _bindEvents",err);
    }
  };

  var _initializeView = function(){
    try{
        debugger;
        var info = Service.getQueryParam("info");
        if(!info){
            return window.location.href="/signup"
        }
        var first_name = "";
        var last_name  = "";
        var data         = info.split(":");
        CONTACT.login = data[0];
        first_name = data ? data[1].split("+")[0] : "";
        last_name = data ? data[1].split("+")[1] : "";
        TYPE             = data[2];

        if(first_name != "no-name" && last_name){
            CONTACT.firstName = first_name;
            CONTACT.lastName  = last_name;
        }

        var password     = Cookie.read("signup");
        if(password){
            var password = password.split(":")[1];
            CONTACT.password = password;
        }

        if(TYPE === "CUSTOMER"){
            var first_nameEle = PROFILE_CONTAINER.querySelector("#user-first-name");
            if(first_nameEle && CONTACT.firstName)
                first_nameEle.value = CONTACT.firstName;
            var last_nameEle = PROFILE_CONTAINER.querySelector("#user-last-name");
            if(last_nameEle && CONTACT.lastName)
                last_nameEle.value = CONTACT.lastName;

            PROFILE_CONTAINER.style.display = "block";
        }else{
            var acc_typeEle = ACCOUNT_CONTAINER.querySelector("#account-type");
            if(acc_typeEle){
                acc_typeEle.value = TYPE;
                acc_typeEle.setAttribute("disabled","disabled");
            }
            ACCOUNT_CONTAINER.style.display = "block";
        }

    }catch(err){
    console.error("Error in _unbindEvents",err);
    }
  };
  var _init = function(){
    try{
        _initializeView();
        _bindEvents();
    }catch(err){
      console.error("Error in _init",err);
    }
  };

  return {
      init : _init
    };

})();

Onboard.init();