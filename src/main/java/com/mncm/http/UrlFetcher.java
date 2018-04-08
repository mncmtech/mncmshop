package com.mncm.http;

import lombok.extern.slf4j.Slf4j;

import java.io.*;
import java.net.HttpURLConnection;
import java.util.logging.Logger;

/**
 * Created by Sonu on 31/03/18.
 */

public class UrlFetcher {

    private static Logger log= Logger.getLogger(UrlFetcher.class.getPackage().getName());

    /**
     * Make get request.
     *
     * @param urlString the url string
     * @return the http response
     * @throws IOException the iO exception
     */
    public static HttpResponse makeGetRequest(String urlString) throws IOException {

        return makeRequest(new HttpRequest(urlString, HttpMethod.GET));
    }

    /**
     * Make request.
     *
     * @param request the request
     * @return the http response
     * @throws IOException the iO exception
     */
    public static HttpResponse makeRequest(HttpRequest request) throws IOException {

        log.info("Fetching url : " + request);

        try {
            HttpURLConnection conn = (HttpURLConnection) request.getUrl().openConnection();

            conn.setRequestMethod(request.getMethod().toString());

            log.info("Fetching url : " + request);

            if (request.getConnectionTimeOut() > 0)
                conn.setConnectTimeout(request.getConnectionTimeOut() * 1000);

            if (request.getHeaders() != null) {

                for (String key : request.getHeaders().keySet()) {
                    conn.setRequestProperty(key, request.getHeaderValue(key));
                }
            }
            log.info("Fetching url : " + request);
            if (request.getMethod() != HttpMethod.GET) {

                conn.setRequestProperty("Content-Type", request.getContentType());

                if (request.getPayload() != null) {
                    conn.setDoOutput(true);

                    OutputStream os = conn.getOutputStream();
                    os.write(request.getPayload());
                    os.flush();
                }
            }

            InputStream is = null;
            StringBuffer responseContent = null;

            try {
                is = conn.getInputStream();
            } catch (IOException e) {
                if (conn.getResponseCode() != 200) {
                    is = conn.getErrorStream();
                }
            }
            log.info("Fetching url : " + is);
            if (is != null) {
                BufferedReader in = new BufferedReader(new InputStreamReader(is));

                String inputLine;
                responseContent = new StringBuffer();

                while ((inputLine = in.readLine()) != null) {
                    responseContent.append(inputLine);
                }
                in.close();
            }
            log.info("Fetching url : " + responseContent);
            HttpResponse httpResponse = new HttpResponse();
            httpResponse.setStatusCode(conn.getResponseCode());
            httpResponse.setResponseContent(responseContent == null ? null : responseContent.toString());

            httpResponse.setHeaders(conn.getHeaderFields());

            conn.disconnect();

            return httpResponse;

        } catch (Exception e) {
            log.info(e.getMessage()+e);
            return null;
        }
    }
}
