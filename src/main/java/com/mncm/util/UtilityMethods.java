package com.mncm.util;

import java.security.MessageDigest;
import java.util.Enumeration;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import com.fasterxml.jackson.core.type.TypeReference;


public class UtilityMethods {
	
	private static Logger logger = Logger.getLogger(UtilityMethods.class.getPackage().getName());
	/**
     * @param base
     * @return SHA-256 encrypted string.
     *
     */
	public static String sha256(String base) {
        try{
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(base.getBytes("UTF-8"));
            StringBuffer hexString = new StringBuffer();

            for (int i = 0; i < hash.length; i++) {
                String hex = Integer.toHexString(0xff & hash[i]);
                if(hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            return hexString.toString();
        } catch(Exception ex){
           throw new RuntimeException(ex);
        }
    }

	public static String getRequestHeader(HttpServletRequest request, String name){
		   String value = "";
		   try{
				if(request !=null){
				Enumeration headerNames = request.getHeaderNames();
		        while (headerNames.hasMoreElements()) {
		        	String key = (String) headerNames.nextElement();
		        	if(key.equalsIgnoreCase(name)){
		        		value = request.getHeader(key);
		        		break;
		        	}
		        }
			}
		   }catch(Exception e){
			   e.printStackTrace();
			   logger.info(e.getMessage());
		   }
		   return value;
	}

	public static String capitalize(String inputStr){
		if(ObjUtil.isNullOrEmpty(inputStr))
			return inputStr;
		try{
			String[] words = inputStr.split("\\s");
			StringBuffer stringBuffer = new StringBuffer();
			for (String str : words) {
                String capitalizedWord = str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
                stringBuffer.append(capitalizedWord+" ");
            }
			return stringBuffer.toString().trim();
		}catch(Exception e){
			e.printStackTrace();
			logger.info(e.getMessage());
		}
		return inputStr;
	}
	
	public static String getDomainFromUrl(String url){

		if(url!=null && !url.isEmpty()) {
            String[] parts = url.split("/");

            if(parts!=null && parts.length>1){
				url=parts[2];
				if(url.contains(":")) {
					url=url.substring(0,url.indexOf(":"));
				}
			}
		}
		return url;
	}



}