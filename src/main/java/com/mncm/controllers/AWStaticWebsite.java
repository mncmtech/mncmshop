package com.mncm.controllers;

import com.mncm.util.ObjUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.net.URI;

@Path("/")
@Produces(MediaType.TEXT_HTML)
public class AWStaticWebsite {

    @Context HttpServletRequest request;
    @Context HttpServletResponse response;

    @GET
    public void loadWebsite() throws Exception {
        response.setStatus(200);
        request.getRequestDispatcher("/WEB-INF/html/dashboard.html").forward(request,response);

    }

    @GET
    @Path("{path : ^dashboard(.html$)?$}")
    public Response loadDashboard(@PathParam("path") String path) throws Exception {
            return Response.status(Response.Status.MOVED_PERMANENTLY).location(URI.create("/")).build();
    }

    @GET
    @Path("{path : ^business(.html$)?$}")
    public Response businessPage(@PathParam("path") String path) throws IOException, ServletException {
        response.setStatus(200);

        if (path.contains(".html") || request.getRequestURI().endsWith("/")) {
            String query=request.getQueryString();
            if(query!=null && query.isEmpty()) {
                return Response.status(Response.Status.MOVED_PERMANENTLY).location(URI.create("/business?" + query)).build();
            }else{
                return Response.status(Response.Status.MOVED_PERMANENTLY).location(URI.create("/business")).build();
            }
        }
        request.getRequestDispatcher("/WEB-INF/html/" + path + ".html").forward(request,response);
        return null;
    }

    @GET
    @Path("{path : ^kissan(.html$)?$}")
    public Response kissanPage(@PathParam("path") String path) throws IOException, ServletException {
        response.setStatus(200);

        if (path.contains(".html") || request.getRequestURI().endsWith("/")) {
            String query=request.getQueryString();
            if(query!=null && query.isEmpty()) {
                return Response.status(Response.Status.MOVED_PERMANENTLY).location(URI.create("/kissan?" + query)).build();
            }else{
                return Response.status(Response.Status.MOVED_PERMANENTLY).location(URI.create("/kissan")).build();
            }
        }
        request.getRequestDispatcher("/WEB-INF/html/" + path + ".html").forward(request,response);
        return null;
    }

    @GET
    @Path("{path : ^login(.html$)?$}")
    public Response loginPage(@PathParam("path") String path) throws IOException, ServletException {
        response.setStatus(200);

        if (path.contains(".html") || request.getRequestURI().endsWith("/")) {
            String query=request.getQueryString();
            if(query!=null && query.isEmpty()) {
                return Response.status(Response.Status.MOVED_PERMANENTLY).location(URI.create("/login?" + query)).build();
            }else{
                return Response.status(Response.Status.MOVED_PERMANENTLY).location(URI.create("/login")).build();
            }
        }
        request.getRequestDispatcher("/WEB-INF/html/" + path + ".html").forward(request,response);
        return null;
    }

    @GET
    @Path("{path : ^signup(.html$)?$}")
    public Response signupPage(@PathParam("path") String path) throws IOException, ServletException {
        response.setStatus(200);

        if (path.contains(".html") || request.getRequestURI().endsWith("/")) {
            String query=request.getQueryString();
            if(query!=null && query.isEmpty()) {
                return Response.status(Response.Status.MOVED_PERMANENTLY).location(URI.create("/signup?" + query)).build();
            }else{
                return Response.status(Response.Status.MOVED_PERMANENTLY).location(URI.create("/signup")).build();
            }
        }
        request.getRequestDispatcher("/WEB-INF/html/" + path + ".html").forward(request,response);
        return null;
    }

    @GET
    @Path("onboard")
    public void processSignup(@QueryParam("info") String info) throws IOException, ServletException {
        System.out.println("info: "+info);
        request.getRequestDispatcher("/WEB-INF/html/onboard.html?info="+info).forward(request,response);
    }

    @GET
    @Path("{path : ^business_signup(.html$)?$}")
    public Response business_signup(@PathParam("path") String path) throws IOException, ServletException {
        response.setStatus(200);

        if (path.contains(".html") || request.getRequestURI().endsWith("/")) {
            String query=request.getQueryString();
            if(query!=null && query.isEmpty()) {
                return Response.status(Response.Status.MOVED_PERMANENTLY).location(URI.create("/business_signup?" + query)).build();
            }else{
                return Response.status(Response.Status.MOVED_PERMANENTLY).location(URI.create("/business_signup")).build();
            }
        }
        request.getRequestDispatcher("/WEB-INF/html/" + path + ".html").forward(request,response);
        return null;
    }
}
