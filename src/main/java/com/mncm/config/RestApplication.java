package com.mncm.config;

import com.mncm.controllers.*;
import com.mncm.filters.CORSFilter;
import com.googlecode.objectify.ObjectifyService;

import javax.ws.rs.core.Application;
import javax.ws.rs.ext.Provider;
import java.util.HashSet;
import java.util.Set;

@Provider
public class RestApplication extends Application {

    public RestApplication(){


    }

	@Override
	public Set<Object> getSingletons() {

        Set<Object> singletons=new HashSet<Object>();

        singletons.add(new JacksonConfig());
        singletons.add(new CORSFilter());

        return singletons;
	}

    public Set<Class<?>> getClasses() {

	    Set<Class<?>> classes = new HashSet<>();

        classes.add(AWStaticWebsite.class);
        classes.add(OAuthController.class);
        classes.add(SignInController.class);
        classes.add(SignupController.class);

        return classes;
    }
}
