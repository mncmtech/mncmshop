package com.mncm.util;

import java.util.*;

import java.util.logging.Logger;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.NewCookie;

public class Cookies {
	private static Logger logger = Logger.getLogger(Cookie.class.getPackage().getName());
	
	public static Cookie create(String name, String value) throws Exception{
		if(ObjUtil.isNullOrEmpty(name) || ObjUtil.isNullOrEmpty(value)){
			throw new Exception("bad_request");
		}
		return new Cookie(name,value);
	}
	public static Cookie delete(String name) throws Exception{
		if(ObjUtil.isNullOrEmpty(name)){
			throw new Exception("bad_request");
		}
		Cookie cookie = new Cookie(name,"");
		cookie.setMaxAge(0);
		return cookie;
	}
	
	public static String get(HttpServletRequest request, String name) throws Exception{
		if(ObjUtil.isNullOrEmpty(name) || request == null){
			throw new Exception("bad_request");
		}
		String cookieValue = null;
		try {
			Cookie cookie[] = request.getCookies();
			System.out.println("======== Cookies ========");
			if (cookie != null) {
				for (int index = 0; index < cookie.length; index++) {
					System.out.println(cookie[index].getName()+":"+cookie[index].getValue());
					if (cookie[index].getName().equalsIgnoreCase(name)) {
						cookieValue = cookie[index].getValue();
						break;
					}
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.info(e.getMessage());
		}
		return cookieValue;
	}
	
	public static HttpServletResponse add(HttpServletRequest request, HttpServletResponse response, HashMap<String, String> cookies) throws Exception{
		if(ObjUtil.isNullOrEmpty(cookies)){
			return response;
		}
		HttpSession session = request.getSession();

		Cookie cookie = null;
		for(String key : cookies.keySet()){
			try{
				String value = cookies.get(key);
				System.out.println(key+":"+value);
				if(ObjUtil.isNullOrEmpty(value)){
					continue;
				}
				cookie = create(key, value);
				response.addCookie(cookie);
				session.setAttribute(key,value);
			}catch(Exception e){
                throw new Exception("bad_request");
            }
		}
		
		return response;
	}

	public static NewCookie[] createResteasyCookies(HashMap<String, String> map, String path, String url)  throws Exception{
        String domain = "";
        try {
            if (!(ObjUtil.isNullOrEmpty(map)) &&  !(ObjUtil.isNullOrEmpty(path)) && !(ObjUtil.isNullOrEmpty(url))) {
                domain = UtilityMethods.getDomainFromUrl(url);
                NewCookie[] cookies = new NewCookie[map.size()];
                int i = 0;
                for (Map.Entry<String, String> entry : map.entrySet()) {
                    NewCookie cookie = new NewCookie(entry.getKey(), entry.getValue().toString(), path, domain, null, -1, false);
                    cookies[i++] = cookie;
                }
                return cookies;
            }
        }
        catch(Exception e){
            throw new Exception("bad_request");
        }
       return  null;
    }

}
