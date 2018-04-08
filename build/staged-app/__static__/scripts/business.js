'use strict';
var Business = (function(){

    let CONTROL_LIST_WRAPPER = document.getElementById("control-item-list");
    let FILTER_ITEM_WRAPPER  = document.getElementById("filter-option-wrapper");
    let MNCM_RIGHT_CONTAINER = document.getElementById("mncm-right-container");

    let _controlListClickHandler = function(event){
        event.preventDefault();
        event.stopPropagation();
        let target = event.target;

        try{
            if(target.nodeName === "LI" || target.nodeName === "SPAN"){

                target = target.nodeName === "LI" ? target.firstElementChild : target;
                _processControlAction(target);

            }
        }catch(err){
            console.error("Error in _controlListClickHandler",err);
        }

    };

    let _processControlAction = function(target){
        if(!target)
            return;
        try{

            var optionName = target.innerText;

            switch(optionName.toUpperCase()){

                case "ORDERS" :
                break;
                case "ADD PRODUCTS" :
                break;
                case "INVENTORY" :
                break;
                case "CATEGORY" :
                break;
                case "APPLICATION" :
                break;
            }

            var control_name_holder = MNCM_RIGHT_CONTAINER.querySelector("#control-name-holder");
            if(control_name_holder)
                control_name_holder.innerText = optionName;

        }catch(err){
            console.error("Error in _processControlAction",err);
        }
    };

    let _processOrderControl = function(){
        try{

        }catch(err){
            console.error("Error in _processOrderControl",err);
        }
    };

    let _processProductControl = function(){
        try{

        }catch(err){
            console.error("Error in _processProductControl",err);
        }
    };


    let _processInventoryControl = function(){
        try{

        }catch(err){
            console.error("Error in _processInventoryControl",err);
        }
    };

    let _processCategoryControl = function(){
        try{

        }catch(err){
            console.error("Error in _processCategoryControl",err);
        }
    };

    let _processApplicationControl = function(){
        try{

        }catch(err){
            console.error("Error in _processApplicationControl",err);
        }
    };

    let _filterItemsClickHandler = function(event){
        event.preventDefault();
        event.stopPropagation();
        let target = event.target;

        try{
            if(target.nodeName === "INPUT" || target.nodeName === "I"){

                var option_holder = target.nodeName === "INPUT" ? target.previousElementSibling : target.nextElementSibling;
                _toggleElement(option_holder);
            }
        }catch(err){
            console.error("Error in _filterItemsClickHandler",err);
        }

    };

    let _toggleElement = function(ele){

        if(!ele)
            return;

        if($(ele).is(":visible")){
            ele.style.display = "none";
            return;
        }

        ele.style.display = "block";
    };

    $(document).on("click",function(){

        var setting_popup = PROFILE_VIEW_WRAPPER.querySelector("#setting-option-wrapper");
        if(setting_popup)
            setting_popup.style.display = "none";

        var filter_popup  = FILTER_ITEM_WRAPPER.querySelector("#filter-option-list-wrapper");
        if(filter_popup)
            filter_popup.style.display = "none";

    });

    let _bindEvents = function(){

        if(CONTROL_LIST_WRAPPER)
            CONTROL_LIST_WRAPPER.addEventListener("click",_controlListClickHandler);

        if(FILTER_ITEM_WRAPPER)
            FILTER_ITEM_WRAPPER.addEventListener("click",_filterItemsClickHandler);

    };

    let _unBindEvents = function(){

        if(CONTROL_LIST_WRAPPER)
            CONTROL_LIST_WRAPPER.removeEventListener("click",_controlListClickHandler);

        if(FILTER_ITEM_WRAPPER)
            FILTER_ITEM_WRAPPER.removeEventListener("click",_filterItemsClickHandler);
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

Business.init();