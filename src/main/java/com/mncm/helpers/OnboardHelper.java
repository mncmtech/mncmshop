package com.mncm.helpers;

import com.mncm.enums.AccountType;
import com.mncm.enums.UserRole;
import com.mncm.util.Cookies;

import java.util.HashMap;
import java.util.logging.Logger;

/**
 * Created by sonudhakar on 18/03/18.
 */
public class OnboardHelper {

    private static Logger logger = Logger.getLogger("com.mncm.helpers.OnboardHelper");

    public static HashMap<String,Object> processLoginRedirect(HashMap<String,Object> dataObj){


        HashMap<String,Object> responseMap = new HashMap<String,Object>();
        try{
            Cookies.delete("contact"); // deleting cookie
            responseMap.put("path", dataObj.get("path"));
            UserRole userRole = (UserRole) dataObj.get("role");
            String accountId  = (String) dataObj.get("accountId");
            String contactId  = (String) dataObj.get("contactId");
            AccountType type       = (AccountType) dataObj.get("type");
            HashMap<String,String> cookies = new HashMap<>();
            cookies.put("contact", accountId+":"+contactId+":"+userRole+":"+type);
            responseMap.put("cookies", cookies);
            responseMap.put("type", type);

        }catch(Exception e){
            e.printStackTrace();
            responseMap.put("path", "/");
        }
        return responseMap;
    }
}
