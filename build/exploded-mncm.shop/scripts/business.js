'use strict';
var Business = (function(){

    let CONTROL_LIST_WRAPPER = document.getElementById("control-item-list");
    let MNCM_RIGHT_CONTAINER = document.getElementById("mncm-right-container");
    let APPLICATION_CONTAINER = document.getElementById("application-form-container");
    let PROFILE_VIEW_WRAPPER = document.getElementById("profile-view-nav");
    let APP_LIST_VIEWER = MNCM_RIGHT_CONTAINER.querySelector("#application-list-viewer");
    let INVENTORY_LIST_VIEWER  = MNCM_RIGHT_CONTAINER.querySelector("#inventroy-list-viewer");
    let APPLICATION_FORM       = MNCM_RIGHT_CONTAINER.querySelector("#application-form-container");
    let CATEGORY_FORM       = MNCM_RIGHT_CONTAINER.querySelector("#category-form-container");
    let PRODUCT_FORM       = MNCM_RIGHT_CONTAINER.querySelector("#product-form-container");

    let _hideAllRightContainers = function(){

        try{
            APP_LIST_VIEWER.style.display = "none";
            INVENTORY_LIST_VIEWER.style.display = "none";
            APPLICATION_CONTAINER.style.display = "none";
            CATEGORY_FORM.style.display = "none";
            PRODUCT_FORM.style.display = "none";
        }catch(err){
            console.error("Error in _hideAllRightContainers",err);
        }
    };
    let _controlListClickHandler = function(event){
        event.preventDefault();
        event.stopPropagation();
        let target = event.target;

        try{
            if(target.nodeName === "LI" || target.nodeName === "SPAN"){

                target = target.nodeName === "LI" ? target.firstElementChild : target;
                _processControlAction(target);

                $(".active").removeClass("active");

                target.parentElement.classList.add("active");

            }
        }catch(err){
            console.error("Error in _controlListClickHandler",err);
        }

    };

    let _processControlAction = function(target){
        if(!target)
            return;
        try{
            _hideAllRightContainers();

            var optionName = target.innerText;

            switch(optionName.toUpperCase()){

                case "ORDERS" :
                _processOrderControl();
                break;
                case "ADD PRODUCTS" :
                _processProductControl();
                break;
                case "INVENTORY" :
                _processInventoryControl();
                break;
                case "CATEGORY" :
                _processCategoryControl();
                break;
                case "APPLICATION" :
                _processApplicationControl();
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
            var item_list_viewer = MNCM_RIGHT_CONTAINER.querySelector("#inventroy-list-viewer");
            if(item_list_viewer)
                item_list_viewer.style.display = "none";

            var action_btn = MNCM_RIGHT_CONTAINER.querySelector("#action-btn");
            if(action_btn){
                action_btn.innerText = "New App";
                action_btn.setAttribute("control-name","application")
            }
            _refreshAppView();
            _getApplications();
        }catch(err){
            console.error("Error in _processApplicationControl",err);
        }
    };

    let _refreshAppView = function(){
        try{
            _toggleElement(APP_LIST_VIEWER);
            var appListEle    = APP_LIST_VIEWER.querySelector("#apps-list");
            if(appListEle)
                appListEle.style.display = "none";

            var emptyView     = APP_LIST_VIEWER.querySelector("#apps-search-empty-state");
            if(emptyView)
                emptyView.style.display = "none";
        }catch(err){
            console.error("Error in _refreshAppView",err);
        }
    };

    let _getApplications = function(dataObj){
        try{
            Service.getAllApplications(dataObj).done(function(response){

                if(response && response.data){
                    _renderApplications(response.data.applications,true);
                    if(response.data.cursor){
                        _getApplications({'cursor' : response.data.cursor,'limit' : 50});
                    }
                }

            }).fail(function(error){

                if(error && error.msg)
                    console.error(error.msg);

            });
        }catch(err){
            console.error("Error in _getApplications",err);
        }
    };

    let _createApplication = function(dataObj){
            try{
                Service.createApplication(dataObj).done(function(response){

                    if(response && response.data){
                        _renderApplications([response.data.application]);
                        if(response.data.cursor){
                            _getApplications({'cursor' : response.data.cursor,'limit' : 50});
                        }
                    }

                }).fail(function(error){

                    if(error && error.msg)
                        console.error(error.msg);

                });
            }catch(err){
                console.error("Error in _getApplications",err);
            }
        };

    let _renderApplications = function(applications,force){
        if(!applications)
            return;

        try{

            APP_LIST_VIEWER.style.display = "block";
            APPLICATION_CONTAINER.style.display = "none";
            var appListEle    = APP_LIST_VIEWER.querySelector("#apps-list");
            var emptyView     = APP_LIST_VIEWER.querySelector("#apps-search-empty-state");

            if(applications.length <= 0){
                emptyView.style.display  = "block";
                appListEle.style.display = "none";
            }

            var lists = "";
            applications.map(application =>{

                var applist = Templates.applicationList({

                    'photoId' : application.photoId,
                    'name'    : application.name,
                    'brandId' : application.brandId,
                    'time'    : new Date(application.createdAt)

                });
                lists += applist;

            });

            if(appListEle){
                if(appListEle.children.length > 0 && !force)
                    $(lists).insertAfter(appListEle.lastElementChild);
                else
                    appListEle.innerHTML = lists;

                appListEle.style.display = "block";
            }

        }catch(err){
            console.error("Error in _renderApplications",err);
        }
    }

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

    let _applicationContainerClickHandler = function(event){

        var target = event.target;

        try{

            if(target.id === "change-app-photo" || target.id === "application-logo"){
                var app_photo_input = APPLICATION_CONTAINER.querySelector("#app-photo-input");
                target = target.id === "change-app-photo" ? target : target.parentElement.querySelector("#change-app-photo");
                if(app_photo_input){
                    app_photo_input.click();
                    target.innerHTML = "Processing...";
                }

            }

            if(target.id === "process-application"){

                var imageEle = APPLICATION_CONTAINER.querySelector("#application-logo");
                var photoId  = imageEle.getAttribute("src");
                var nameEle  = APPLICATION_CONTAINER.querySelector("#app-name-input");
                var name     = nameEle.value;

                var requestObj = {
                    'photoId' : photoId,
                    'name'    : name
                };

                _createApplication(requestObj).done(function(response){

                    if(response && response.data){
                       _refreshAppView();
                       _renderApplications(response.data.applications);
                    }

                }).fail(function(error){
                    if(error && error.msg)
                        console.error(error.msg);
                });
            }

        }catch(err){
            console.error("Error in _applicationContainerClickHandler",err);
        }

    };

    let _fileUploadChangeHandler = function(event){

        var target = event.target;

        try{
            var formData = new FormData();
            var files = event.srcElement.files;

            for(var index=0;index < files.length; index++){
                try{
                    var file = files[index];

                    if(!file)
                        continue;

                    formData.append("fileAttach",file);

                }catch(err){
                    console.error("Error in _fileUploadChangeHandler",err);
                }
            }

            Service.uploadFile(formData).done(function(response){

                console.warn(response);

                if(response && response.data){

                    if(target.id === "app-photo-input"){
                        response.data.attachments.map(link =>{

                             target.nextElementSibling.setAttribute("src",link);
                             target.previousElementSibling.firstElementChild.innerText = "Change";

                        });

                    }
                }


            }).fail(function(error){

                console.warn(error);
                target.previousElementSibling.firstElementChild.innerText = "Change";

            }).always(function(){
                target.previousElementSibling.firstElementChild.innerText = "Change";
            });


        }catch(err){
            console.error("Error in _fileUploadChangeHandler",err);
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

    });

    let _rightContainerHeaderClickHandler = function(event){

        var target = event.target;
        try{
            switch(target.getAttribute("control-name")){

                case "application" :
                    _hideAllRightContainers();
                    _toggleElement(APPLICATION_CONTAINER);
                break;
                case "inventory" :
                    _createInventory();
                break;
                case "category" :
                    _createCategory();
                break;
                case "add-products" :
                    _linkProductsToAccount();
                break;

            }
        }catch(err){
            console.error("Error in _rightContainerHeaderClickHandler",err);
        }
    };

    let _bindEvents = function(){

        if(CONTROL_LIST_WRAPPER)
            CONTROL_LIST_WRAPPER.addEventListener("click",_controlListClickHandler);

//        if(FILTER_ITEM_WRAPPER)
//            FILTER_ITEM_WRAPPER.addEventListener("click",_filterItemsClickHandler);

        if(APPLICATION_CONTAINER)
            APPLICATION_CONTAINER.addEventListener("click",_applicationContainerClickHandler);

        var app_photo_input = APPLICATION_CONTAINER.querySelector("#app-photo-input");

        if(app_photo_input)
            app_photo_input.addEventListener("change",_fileUploadChangeHandler);

        var right_container_header = MNCM_RIGHT_CONTAINER.querySelector("#right-container-header");
        if(right_container_header)
            right_container_header.addEventListener("click",_rightContainerHeaderClickHandler);


    };

    let _unBindEvents = function(){

        if(CONTROL_LIST_WRAPPER)
            CONTROL_LIST_WRAPPER.removeEventListener("click",_controlListClickHandler);

//        if(FILTER_ITEM_WRAPPER)
//            FILTER_ITEM_WRAPPER.removeEventListener("click",_filterItemsClickHandler);
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