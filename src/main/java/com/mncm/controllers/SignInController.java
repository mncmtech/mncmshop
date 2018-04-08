package com.mncm.controllers;

import com.mncm.models.ApiResponse;
import com.mncm.models.SignupResponse;
import com.mncm.util.ObjUtil;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.net.URI;
import java.util.HashMap;
import java.util.logging.Logger;

/**
 * Created by sonudhakar on 24/03/18.
 */
@Path("signin")
public class SignInController {

    private static Logger log= Logger.getLogger(SignInController.class.getPackage().getName());

    @Context
    HttpServletRequest request;
    @Context
    HttpServletResponse response;

    @POST
    @Produces("application/json")
    public Response signin(HashMap<String,String> requestObj){
        ApiResponse apiResponse = new ApiResponse();
        try{
            if(requestObj == null)
                return Response.seeOther(URI.create("/login?err=invalid_request")).build();

            OAuthController authController = new OAuthController();

            HashMap<String,Object> responseData = authController.processUserSignIn(response,request,requestObj);
            System.out.println("data is :: "+responseData);
            if(responseData != null){
                SignupResponse signupResponse = (SignupResponse) responseData.get("data");
                apiResponse.setData(ObjUtil.convertToMap(signupResponse));
                apiResponse.setOk(true);
            }
        }catch(Exception e){
            log.info(e.getMessage());
        }

        return Response.ok().entity(apiResponse).build();

    }
}
