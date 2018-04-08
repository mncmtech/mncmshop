package com.mncm.controllers;

import com.mncm.enums.AccountType;
import com.mncm.enums.UserRole;
import com.mncm.helpers.OnboardHelper;
import com.mncm.http.*;
import com.mncm.http.HttpMethod;
import com.mncm.models.*;
import com.mncm.util.*;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
import java.net.URI;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.logging.Logger;

/**
 * Created by sonudhakar on 24/03/18.
 */
@Path("/signup")
public class SignupController {

    private static Logger log= Logger.getLogger(SignupController.class.getPackage().getName());

    @Context
    HttpServletRequest request;

    @Context
    HttpServletResponse response;

    @Path("/")
    @GET
    @Produces("text/html")
    public void processSignup() throws Exception {
        request.getRequestDispatcher("/WEB-INF/html/signup.html").forward(request,response);
    }

//    @POST
//    @Path("/account/process")
//    public Response signup(HashMap<String,String> requestObj){
//
//        try{
//            System.out.print("coming here");
//            if(requestObj == null)
//                return Response.seeOther(URI.create("/singup?err=invalid_request")).build();
//
//            String email = requestObj.get("login");
//            String type  = requestObj.get("type");
//
//            return Response.seeOther(URI.create("/onboard/process?info=" + email + ":no-name"+":"+type)).build();
//
//        }catch(Exception e){
//            log.info(e.getMessage());
//        }
//        return Response.noContent().build();
//    }

    @POST
    @Path("/account/create")
    @Produces("application/json")
    public Response singupProcess(RegistrationRequestModel requestModel){
        ApiResponse apiResponse = new ApiResponse();
        try{

            String url = WorkConstants.MNCM_URL+"/signup/process";
            HashMap<String,Object> responseMap = new HashMap<>();
            String payload = StringConverterUtil.getJsonString(requestModel);
            System.out.println("payload requesting with :: "+payload);

            HttpRequest httpRequest = new HttpRequest(url, HttpMethod.POST);

            httpRequest.setPayload(payload);
            httpRequest.setContentType("application/json");
            HttpResponse response = UrlFetcher.makeRequest(httpRequest);


//            HttpResponse httpResponse = UrlFetchServiceUtil.makeHTTPRequest(url,"POST",payload,"application/json",null);
//            log.info("Account Create Response :" + httpResponse.getResponseContent());
            apiResponse = JsonUtil.convertSafeToType(response.getResponseContent(), ApiResponse.class);
            SignupResponse signupResponse = JsonUtil.convertObjToType(apiResponse.getData().get("response"), SignupResponse.class);

            HashMap<String, Object> respMap = processLogin(signupResponse); //Processing login

            if ((respMap.get("cookies"))!=null) {
                String path = (String) respMap.get("path");
                Cookies.createResteasyCookies(((HashMap<String, String>) respMap.get("cookies")), path, request.getRequestURL().toString());
            }

            apiResponse = new ApiResponse();

            if(signupResponse != null) {
                apiResponse.setData(ObjUtil.convertToMap(signupResponse));
                apiResponse.setOk(true);
            }

        }catch(Exception e){
            log.info(e.getMessage());
        }
        return Response.ok().entity(apiResponse).build();
    }

    public HashMap<String, Object> processLogin(SignupResponse signupResponse){

        try{
            log.info("response"+signupResponse);
            Contact contact = signupResponse.getContact();
            UserRole userRole = signupResponse.getRole();
            AccountType accountType = signupResponse.getAccountType();
            HashMap<String, Object> respMap = new HashMap<String, Object>();
            HashMap<String, Object> requestMap = new HashMap<String, Object>();
            if(contact != null) {
                requestMap.put("contactId", contact.getId());
                requestMap.put("accountId", contact.getAccountId());
            }
            requestMap.put("role",userRole);
            requestMap.put("type",accountType);

            switch (accountType){
                case BUSINESS:
                    requestMap.put("path","/business");
                    break;
                case CUSTOMER:
                    requestMap.put("path","/");
                    break;
                case KISSAN:
                    requestMap.put("path","kissan");
                    break;
            }

            System.out.println("processing login with "+requestMap);
            respMap = OnboardHelper.processLoginRedirect(requestMap);
            System.out.println("processing resposese "+respMap);

            return respMap;

        }catch(Exception e){
            log.info(e.getMessage());
        }
        return null;
    }
}
