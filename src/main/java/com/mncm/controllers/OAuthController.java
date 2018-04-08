package com.mncm.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mncm.enums.AccountType;
import com.mncm.enums.UserRole;
import com.mncm.helpers.OnboardHelper;
import com.mncm.http.HttpMethod;
import com.mncm.http.HttpRequest;
import com.mncm.http.HttpResponse;
import com.mncm.http.UrlFetcher;
import com.mncm.models.ApiResponse;
import com.mncm.models.Contact;
import com.mncm.models.SignupResponse;
import com.mncm.models.UserRoleModel;
import com.mncm.util.*;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

/**
 * Created by sonudhakar on 18/03/18.
 */
@Path("/oauth")
public class OAuthController {

    private static Logger log= Logger.getLogger(OAuthController.class.getPackage().getName());
    private static String requestUrl;
    private static HashMap<String, Object> requestHeaders;

    private String getRequestURL(HttpServletRequest request) {
        requestUrl = request.getRequestURL().toString();
        requestUrl = requestUrl.split("/")[0] + "//" + requestUrl.split("/")[2];
        return requestUrl;
    }

    @Context HttpServletRequest request;
    @Context HttpServletResponse response;

    @GET
    @Path("/google/authenticate/signin")
    public Response getAuthSignIn(@Context HttpServletRequest request, @Context HttpServletResponse response,@QueryParam("type") AccountType type) throws IOException,ServletException {
        return Response.seeOther(URI.create("https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.profile+https://www.googleapis.com/auth/userinfo.email&access_type=offline&redirect_uri=" + getRequestURL(request) + "/oauth/google/signin/authcallback" + "&response_type=code&client_id=" + WorkConstants.clientId)).build();
    }

    @GET
    @Path("/google/authenticate/signup")
    public Response getAuthSingUp(@Context HttpServletRequest request, @Context HttpServletResponse response, @QueryParam("type") String type) throws Exception {

        requestHeaders = new HashMap<String, Object>();
        requestHeaders.put("X-AppEngine-City", UtilityMethods.getRequestHeader(request, "X-AppEngine-City"));
        requestHeaders.put("X-AppEngine-Region", UtilityMethods.getRequestHeader(request, "X-AppEngine-Region"));
        requestHeaders.put("X-AppEngine-Country", UtilityMethods.getRequestHeader(request, "X-AppEngine-Country"));
        return Response.seeOther(URI.create("https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.profile+https://www.googleapis.com/auth/userinfo.email&access_type=offline&redirect_uri=" + getRequestURL(request) + "/oauth/google/signup/authcallback" + "&response_type=code&client_id=" + WorkConstants.clientId + "&state=" + type)).build();
    }

    @GET
    @Path("/google/signin/authcallback")
    public Response processGoogleSignInCallBack(@Context HttpServletRequest request, @Context HttpServletResponse response) throws IOException{
        try{
            String googleOauthCallback = "google/signin/authcallback";
            String token = fetchGoogleToken(request,googleOauthCallback);
            if(token == null)
                return Response.noContent().build(); //TODO : Need to redirect error page!

            Map<String,String> tokenMap =  getTokenWithTokenString(token);
            String accessToken = tokenMap.get("access_token");

            setAccessTokenInSession(tokenMap,request);

            Map<String, String> userDetail = getUserProfile(tokenMap);

            HashMap<String,Object> responseData = processUserSignIn(response,request,userDetail);

            if(responseData != null){
                String redirectPath = (String) responseData.get("path");
                NewCookie[] cookies = (NewCookie[]) responseData.get("cookies");
                return Response.temporaryRedirect(URI.create(redirectPath)).cookie(cookies).build();
            }

        }catch(Exception e){
            log.info("Error during google oauth callback"+e);
        }
        return Response.noContent().build(); //TODO : Need to redirect error page!
    }

    @GET
    @Path("/google/signup/authcallback")
    public Response processGoogleSignUpCallBack(@Context HttpServletRequest request,@Context HttpServletResponse response) throws IOException{
        try{
            String googleOauthCallback = "google/signup/authcallback";
            String token = fetchGoogleToken(request,googleOauthCallback);
            if(token == null)
                return Response.noContent().build(); //TODO return appropriate error page!;
            String state = request.getParameter("state");
            Map<String,String> tokenMap =  getTokenWithTokenString(token);

            setAccessTokenInSession(tokenMap,request);

            Map<String, String> userDetail = getUserProfile(tokenMap);
            String emailAddress = userDetail.get("email");
            String name = userDetail.get("name");

            return Response.seeOther(URI.create("/onboard?info=" + emailAddress + ":" + URLEncoder.encode(name, "UTF-8")+":"+state)).build();

        }catch(Exception e){
            log.info("Error during google oauth callback"+e);
        }
        return Response.noContent().build(); //TODO return appropriate error page!
    }

    public HashMap<String,Object> processUserSignIn(HttpServletResponse response, HttpServletRequest request, Map<String, String> userDetail) {

        HashMap<String,Object> responsedata = new HashMap<>();
        try {

            String emailAddress = userDetail.get("email");
            String password     = userDetail.get("password");
            boolean isSocial    = false;

            if(ObjUtil.isBlank(password))
                isSocial = true;

            String url = WorkConstants.MNCM_URL + "/user/login?isSocial="+isSocial;
            HashMap<String, String> requestJson = new HashMap<>();
            requestJson.put("login", emailAddress);

            if(!ObjUtil.isBlank(password))
                requestJson.put("password",password);

            String payload = StringConverterUtil.getJsonString(requestJson);
            HashMap<String, Object> responseMap = new HashMap<String, Object>();

            System.out.println("Request to login" + requestHeaders + payload);

            HttpRequest httpRequest = new HttpRequest(url, HttpMethod.POST);

            httpRequest.setPayload(payload);
            httpRequest.setContentType("application/json");
            HttpResponse httpResponse = UrlFetcher.makeRequest(httpRequest);

            log.info("login response :" + httpResponse.getResponseContent());

            ApiResponse apiResponse = JsonUtil.convertSafeToType(httpResponse.getResponseContent(), ApiResponse.class);

            if(apiResponse.isOk()) {

                SignupResponse signupResponse = JsonUtil.convertObjToType(apiResponse.getData().get("response"), SignupResponse.class);

                SignupController signupController = new SignupController();

                HashMap<String, Object> respMap = signupController.processLogin(signupResponse);

                if (ObjUtil.isNullOrEmpty(respMap)) {
                    response.sendRedirect("/");
                }

                String redirectPath = respMap.get("path").toString();
                responsedata.put("path", redirectPath);
                System.out.println("cookies respone" + respMap);
                if ((respMap.get("cookies")) != null) {
                    log.info("coming here");
                    NewCookie[] cookies = Cookies.createResteasyCookies(((HashMap<String, String>) respMap.get("cookies")), redirectPath, request.getRequestURL().toString());
                    responsedata.put("cookies", cookies);
                }
                responsedata.put("data", signupResponse);
            }

        } catch (Exception e) {
            log.info("Not able to process processUserSignIn" + e);
        }

        return responsedata;
    }

    private UserRole getUserRole(Map<String, Object> data){

        try{
            UserRoleModel userRoleModel = (UserRoleModel) data.get("role");
            if(userRoleModel != null){
                return userRoleModel.getRole();
            }
        }catch(Exception e){
            log.info(e.getMessage());
        }
        return null;
    }

    private String fetchGoogleToken(HttpServletRequest request,String callback){
        try{
            String authcode = request.getParameter("code");
            if(authcode != null){
                String url = "https://www.googleapis.com/oauth2/v4/token";
                String params = "code="+authcode+"&client_id="+ WorkConstants.clientId+"&client_secret="+WorkConstants.clientSecret+"&redirect_uri="+getRequestURL(request)+"/oauth/"+callback+"&grant_type=authorization_code";
                String tokens = UrlFetchServiceUtil.httpRequestProcess(url, params,"POST","application/x-www-form-urlencoded", 0);
                return tokens;
            }
        }catch(Exception e){
            log.info("Error during google oauth callback"+e);
        }
        return null;
    }

    private Map<String, String> getTokenWithTokenString(String toekn){

        try{
            ObjectMapper obj = new ObjectMapper();

            return obj.readValue(toekn,new TypeReference<Map<String,String>>(){});
        }catch(Exception e){
            log.info("Error during google oauth callback"+e);
        }
        return null;
    }

    private void setAccessTokenInSession(Map<String,String> token,HttpServletRequest request){

        try{
            String accessToken = token.get("access_token");
            HttpSession session = request.getSession();
            session.setAttribute("userAccessToken",accessToken);
        }catch(Exception e){
            log.info("Error setting accessToken in Session"+e);
        }
    }

    public Map<String, String> getUserProfile(Map<String, String> token) {
        try {
            String id_token = token.get("id_token");
            String url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + id_token;
            String userDetail = UrlFetchServiceUtil.httpRequestProcess(url, null, "GET", "application/x-www-form-urlencoded", 0);

            ObjectMapper obj = new ObjectMapper();
            Map<String, String> userInfo = obj.readValue(userDetail, new TypeReference<Map<String, String>>() {
            });
            return userInfo;
        } catch (Exception e) {
            return null;
        }
    }
}
