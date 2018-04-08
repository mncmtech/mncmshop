'use strict';
var Header = (function(){

    let PROFILE_VIEW_WRAPPER = document.getElementById("profile-view-nav");

    let _profileViewClickHandler = function(event){
        event.preventDefault();
        event.stopPropagation();
        let target = event.target;

        try{
            if(target.classList.contains("user-name-wrapper") || target.classList.contains("mncm-user-name")){
                target = target.classList.contains("user-name-wrapper") ? target : target.parentElement;
                _toggleElement(target.nextElementSibling);
            }

        }catch(err){
            console.error("Error in _profileViewClickHandler",err);
        }
    };

    let _bindEvents = function(){

        if(PROFILE_VIEW_WRAPPER)
            PROFILE_VIEW_WRAPPER.addEventListener("click",_profileViewClickHandler);

    };

    let _unBindEvents = function(){

        if(PROFILE_VIEW_WRAPPER)
            PROFILE_VIEW_WRAPPER.removeEventListener("click",_profileViewClickHandler);

    };

    let _init = function(){

        _bindEvents();

    };

    let _destroy = function(){

        _unBindEvents();
    };

    return {
        'init'      : _init,
        'destroy'   : _destroy
    }

})();

Header.init();