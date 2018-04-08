'use strict';
var Admin = (function(){

    let NAVE_SECTION_PANEL = document.getElementById("nave-section-panel");
    let MAIN_RIGHT_PANEL = document.getElementById("mncm-right-container");

    let _naveSectionPanelClickHandler = function(event){

        let _target = event.target;

        try{

        }catch(err){
            console.error("Error in _naveSectionPanelClickHandler",err);
        }
    };

    let _mainRightContainerClickHandler = function(event){

        let _target = event.target;

        try{

        }catch(err){
            console.error("Error in _mainRightContainerClickHandler",err);
        }

    };

    let _bindEvents = function(){

        if(NAVE_SECTION_PANEL)
            NAVE_SECTION_PANEL.addEventListener("click",_naveSectionPanelClickHandler);

        if(MAIN_RIGHT_PANEL)
            MAIN_RIGHT_PANEL.addEventListener("click",_mainRightContainerClickHandler);

    };

    let _unBindEvents = function(){

        if(NAVE_SECTION_PANEL)
            NAVE_SECTION_PANEL.addEventListener("click",_naveSectionPanelClickHandler);

        if(MAIN_RIGHT_PANEL)
            MAIN_RIGHT_PANEL.addEventListener("click",_mainRightContainerClickHandler);

    };

    let _init = function(){

        _bindEvents();

    };

    let _destroy = function(){

        _unBindEvents();
    };

})();