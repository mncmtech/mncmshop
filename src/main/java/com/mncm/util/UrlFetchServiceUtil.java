package com.mncm.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.logging.Logger;

import com.fasterxml.jackson.core.type.TypeReference;

public class UrlFetchServiceUtil {
	
	private static Logger logger = Logger.getLogger(UrlFetchServiceUtil.class.getPackage().getName());
	
	/**
	 * Returns HTTPURLConnection object
	 * @param url
	 * @return
	 * @throws Exception
	 */
	public static HttpURLConnection getHttpConnection(String url, String method, String contentType) throws Exception{
		if(ObjUtil.isNullOrEmpty(url) || ObjUtil.isNullOrEmpty(method)){
			throw new Exception("URL/Method is not available.");
		}
		URL httpUrl = new URL(url);
		HttpURLConnection connection = (HttpURLConnection) httpUrl.openConnection();
		try{
			connection.setDoInput(true);
			connection.setDoOutput(true);
			connection.setRequestMethod(method);
			connection.setReadTimeout(60000);	
			connection.setConnectTimeout(60000);
			connection.setInstanceFollowRedirects(false);
			connection.setRequestProperty("User-Agent","Mozilla/5.0 (Windows NT 5.1; rv:19.0) Gecko/20100101 Firefox/19.0");
			
			if(!ObjUtil.isNullOrEmpty(contentType)){
				connection.setRequestProperty("Content-Type",contentType);
				connection.setRequestProperty("ACCEPT",contentType);
			}
		
		}catch(Exception e){
			logger.info("Exception while getting HTTPURLConnection");
			throw new Exception(e.getMessage());
		}
		return connection;
	};
	
	public static String httpRequest(String urlString, String params, String methodName, String contentType) throws Exception{
		
		StringBuffer responseJson = new StringBuffer();
		String responseData  = "";
		try{
			
			System.out.println(";-----; checking method " + methodName);
			URL url = new URL(urlString);

			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setDoInput(true);
			connection.setDoOutput(true);
			connection.setRequestMethod(methodName);
			connection.setReadTimeout(60000);	
			connection.setConnectTimeout(60000);
			connection.setInstanceFollowRedirects(false);
			connection.setRequestProperty("User-Agent","Mozilla/5.0 (Windows NT 5.1; rv:19.0) Gecko/20100101 Firefox/19.0");
			
			if(contentType != null && !contentType.isEmpty()){
				connection.setRequestProperty("Content-Type",contentType);
				connection.setRequestProperty("ACCEPT",contentType);
			}
			
			if(params != null && !params.isEmpty()){
				OutputStream os = connection.getOutputStream();
                os.write(params.getBytes());
                os.flush();
			}

			System.out.println(";-----; response code " + connection.getResponseCode());

			if(connection.getResponseCode() >= HttpURLConnection.HTTP_OK && connection.getResponseCode() < HttpURLConnection.HTTP_MULT_CHOICE){
				BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
				
				logger.info("header " + connection.getHeaderField("Link"));
				

				String responseString = "";
				while ((responseString = reader.readLine()) != null) {

					responseJson.append(responseString);
				}
			}else{
				
				BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
				
				logger.info("header " + connection.getHeaderField("Link"));
				

				String responseString = "";
				while ((responseString = reader.readLine()) != null) {

					responseJson.append(responseString);
				}
				
				if(responseJson.toString().isEmpty()){
					responseJson.append("{\"error\" : \"Error from server " + connection.getResponseCode() + ".\"}");
				}
				
				
			}

			responseData = responseJson.toString();
		}catch(IOException e){
			responseData = httpRequestProcess(urlString, params, methodName, contentType, 1);
		}catch(Exception e){			
			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			System.out.println(sw.toString());
			throw e;
		}
		return responseData;
	}
	
	public static String authenticationHttpRequest(String urlString, String params, String methodName, String contentType, String access_Token) {
		StringBuffer responseJson = new StringBuffer();
		String responseData  = "";
		try{
			
			System.out.println(";-----; checking method " + methodName);
			URL url = new URL(urlString);

			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setDoInput(true);
			connection.setDoOutput(true);
			connection.setRequestMethod(methodName);
			connection.setReadTimeout(60000);
			connection.setConnectTimeout(60000);
			connection.setInstanceFollowRedirects(false);
			
			if(contentType != null && !contentType.isEmpty()){
				connection.setRequestProperty("Content-Type",contentType);
				connection.setRequestProperty("Authorization","Bearer "+access_Token);

			}
			else{
				connection.setRequestProperty("Authorization","Bearer "+access_Token);

			}
			if(params != null && !params.isEmpty()){
				OutputStreamWriter writers = new OutputStreamWriter(connection.getOutputStream());
				writers.write(params);
				writers.flush();
			}

			System.out.println(";-----; response code " + connection.getResponseCode());

			if(connection.getResponseCode() == HttpURLConnection.HTTP_OK){
				BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));

				String responseString = "";
				while ((responseString = reader.readLine()) != null) {

					responseJson.append(responseString);
				}
			}else{
				responseJson.append("{\"error\" : \"Error from server " + connection.getResponseCode() + ".\"}");
			}

			responseData = responseJson.toString();
	
		}catch(Exception e){
			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			System.out.println(sw.toString());
		}
		return responseData;
	}
	
	public static String shorten(String longUrl) {
        if (longUrl == null) {
            return longUrl;
        }
        
        try {
            URL url = new URL("https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyCq81yfRtt-CVaq8AUss9W1fibePVnZswg");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            //connection.setRequestProperty("User-Agent", "toolbar");
          
            HashMap<String, String> paramMap = new HashMap<String, String>();
            paramMap.put("longUrl", longUrl.replace("/gs/", "http://"));
			String paramJson = StringConverterUtil.getObjectMapper().writeValueAsString(paramMap);
           
			OutputStreamWriter writer = new OutputStreamWriter(connection.getOutputStream());
            writer.write(paramJson);
            writer.close();
            
            logger.info(";-----; response code " + connection.getResponseCode());
            
            if(connection.getResponseCode() != HttpURLConnection.HTTP_OK || connection.getResponseCode() != 200 )
            	return longUrl;
            
            StringBuilder responseJson = new StringBuilder();
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        	
			String responseString = "";
			while ((responseString = reader.readLine()) != null) {
				
				responseJson.append(responseString);
			}
			logger.info("ApiResponse JSON :: "+responseJson);
			TypeReference<HashMap<String, Object>> typeRef = new TypeReference<HashMap<String, Object>>() {};
			
			HashMap<String, Object> responseMap = StringConverterUtil.getObjectMapper().readValue(responseJson.toString(), typeRef);
            return responseMap.get("id").toString();
        } catch (MalformedURLException e) {
            return longUrl;
        } catch (IOException e) {
            return longUrl;
        }
    }
	
	public static HashMap<String, String> httpGitRepoRequest(String urlString, String params, String methodName, String contentType) throws Exception{
		
		HashMap<String, String> responseMap = new HashMap<String, String>();
		
		StringBuffer responseJson = new StringBuffer();
		String responseData  = "";
		
		String nextPageLink = "";
		
		try{
			
			System.out.println(";-----; checking method " + methodName);
			URL url = new URL(urlString);

			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setDoInput(true);
			connection.setDoOutput(true);
			connection.setRequestMethod(methodName);
			connection.setReadTimeout(60000);
			connection.setConnectTimeout(60000);
			connection.setInstanceFollowRedirects(false);
			connection.setRequestProperty("User-Agent","Mozilla/5.0 (Windows NT 5.1; rv:19.0) Gecko/20100101 Firefox/19.0");
			
			if(contentType != null && !contentType.isEmpty()){
				connection.setRequestProperty("Content-Type",contentType);
				connection.setRequestProperty("ACCEPT",contentType);
			}
			if(params != null && !params.isEmpty()){
				OutputStreamWriter writers = new OutputStreamWriter(connection.getOutputStream());
				writers.write(params);
				writers.flush();
			}

			System.out.println(";-----; response code " + connection.getResponseCode());

			if(connection.getResponseCode() >= HttpURLConnection.HTTP_OK && connection.getResponseCode() < HttpURLConnection.HTTP_MULT_CHOICE){
				BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
				
				nextPageLink = connection.getHeaderField("Link");
				
				logger.info("Link Header " + nextPageLink);
				
				if(nextPageLink != null && nextPageLink.contains("rel=\"next\"")){
					
					String[] pageLinks = nextPageLink.split(",");
					
					if(pageLinks.length > 0){
						String linkURL = pageLinks[0].split(";")[0].replace("<", "").replace(">","");
						
						logger.info("linkURL " + linkURL);
						
						nextPageLink = linkURL;
						
					}
					 
					
				}else{
					nextPageLink = null;
				}

				String responseString = "";
				while ((responseString = reader.readLine()) != null) {

					responseJson.append(responseString);
				}
			}else{
				responseJson.append("{\"error\" : \"Error from server " + connection.getResponseCode() + ".\"}");
			}

			responseData = responseJson.toString();
			
			responseMap.put("responseData", responseData);
			responseMap.put("nextPageLink", nextPageLink);
			
		}catch(IOException e){
			responseData = httpRequestProcess(urlString, params, methodName, contentType, 1);
		}catch(Exception e){			
			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			System.out.println(sw.toString());
			throw e;
		}
		return responseMap;
	}
	

	public static String httpRequestProcess(String urlString, String params, String methodName, String contentType,int counter) throws Exception{
	
		StringBuffer responseJson = new StringBuffer();
		String responseData  = "";
		System.out.println("HttpRequestProcess Counter "+counter);
		try{
			URL url = new URL(urlString);
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setDoInput(true);
			connection.setDoOutput(true);
			connection.setRequestMethod(methodName);
			connection.setReadTimeout(60000);
			connection.setConnectTimeout(60000);
			if(contentType != null && !contentType.isEmpty()){
				connection.setRequestProperty("Content-Type",contentType);
			}
			if(params != null && !params.isEmpty()){
				OutputStreamWriter writers = new OutputStreamWriter(connection.getOutputStream());
				writers.write(params);
				writers.flush();
			}
	
			System.out.println(";-----; response code " + connection.getResponseCode());
	
			if(connection.getResponseCode() == HttpURLConnection.HTTP_OK){
				BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
	
				String responseString = "";
				while ((responseString = reader.readLine()) != null) {
	
					responseJson.append(responseString);
				}
			}else{
				responseJson.append("{\"error\" : \"Error from server " + connection.getResponseCode() + ".\"}");
			}
	
			responseData = responseJson.toString();
		}catch(IOException e){
			System.out.println("Resending HttpRequest.. "+counter);
			if(counter <3){
				counter = counter+1;
				responseData = httpRequestProcess(urlString, params, methodName, contentType, counter);
			}else{
				responseData = "{\"error\" : \"Error While Processing Request.\"}";				
				StringWriter sw = new StringWriter();
				PrintWriter pw = new PrintWriter(sw);
				e.printStackTrace(pw);
				System.out.println(sw.toString());
				throw e;
			}
		}catch(Exception e){			
			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			System.out.println(sw.toString());
			throw e;
		}
		System.out.println("response Data in http process "+ responseData);
		return responseData;
	}
	

}
