'use strict';

var Templates = (function(templates) {

    var application = Object.defineProperties({}, {
      HTML : {
        value :
            '<li class="user-contact"><div class="item-details "><figure><img src="{{=data.photoId}}"></figure><span class="item-name">{{=data.name}}</span><span class="item-desg">{{=data.time}}</span></div><div class="item-price"><span>{{=data.brandId}}</span></div></li>'
      },
      imageLink : {
         value :
             '<li data-link="{{=data.link}}"></li>'
      }
    });

    templates.applicationList = tmpl(application.HTML);
    templates.imageLink       = tmpl(application.imageLink);

    return templates;

  })({});
