package com.mncm.util;

import static com.google.appengine.api.utils.SystemProperty.environment;

import com.google.appengine.api.modules.ModulesService;
import com.google.appengine.api.modules.ModulesServiceFactory;
import com.google.appengine.api.utils.SystemProperty;
import com.google.appengine.api.utils.SystemProperty.Environment.Value;

public class WorkConstants {

	public static final SystemProperty.Environment.Value env = environment.value();

	private static final String appVersion = SystemProperty.applicationVersion.get();
//	private static String appId 		   = ApiProxy.getCurrentEnvironment().getAppId();

	public static boolean isProduction = false;
	public static String App_URL;
	
	public static String MNCM_URL;
	public static String MNCM_ClientId;
	public static String MNCM_ClientSecret;
	
	public static String clientId      = "364129258442-8js2haqbcv3crsnb5f9s2rdmvrk48icv.apps.googleusercontent.com";
	public static String clientSecret  = "QTwI9DZwdi3FCsB8cLlM-rSo";

	static{
		ModulesService moduleService = ModulesServiceFactory.getModulesService();
		String version = "";
		if(appVersion != null) {
			version = appVersion.split("\\.")[0];
		}
		try{
			if( env == Value.Development) {
				App_URL 		  = "https://staging-dot-mncmshop.appspot.com";
				MNCM_URL  		  = "https://staging-dot-mncm-196208.appspot.com/api/v1";
				//MNCM_URL  		  = "http://localhost:8886/api/v1";
				
			}else if( env == Value.Production ) {

//				if ("staging".equals(version)) { // TODO : Need to have specific versions for staging.
				if ("staging".equals(moduleService.getCurrentModule())) {
					App_URL 		  = "https://staging-dot-mncmshop.appspot.com";
					MNCM_URL  		  = "https://staging-dot-mncm-196208.appspot.com/api/v1";
					//MNCM_URL  		  = "http://localhost:8886/api/v1";

				} else {
					App_URL 		  = "https://mncmshop.appspot.com";
					MNCM_URL  		  = "https://mncm-196208.appspot.com/api/v1";
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}

	}

}