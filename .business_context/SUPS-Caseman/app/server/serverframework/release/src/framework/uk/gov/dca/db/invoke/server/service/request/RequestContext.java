package uk.gov.dca.db.invoke.server.service.request;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.invoke.server.MethodConfig;
import uk.gov.dca.db.invoke.server.handlers.ContentHandler;
import uk.gov.dca.db.invoke.server.handlers.HttpRequestHandler;
import uk.gov.dca.db.invoke.server.handlers.IRequestHandler;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * @author Imran Patel
 * 
 */
public class RequestContext {

    private static Log log = SUPSLogFactory.getLogger(RequestContext.class);

    private Iterator handlerItr;

    private int contentLength = 0;
    private ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

    public String threadName = Thread.currentThread().getName();

    public String user;

    public String password;

    public String mac;

    public String requestPayload;

    public String serviceName;

    public String targetMethod;

    public boolean isSecure;

    private boolean isGet;

    private HashMap values = new HashMap();

    private MethodConfig methodConfig;

    private List handlers = null;

    private HttpServletRequest request;

    private HttpServletResponse response;

    private List defaultGetHandlers;

    private List defaultPostHandlers;

    private String responseMimeType = "text/xml";
	
	private HashMap headerDetails = new HashMap();

    public RequestContext() {
    }

    public RequestContext(List defaultGetHandlers, List defaultPostHandlers, HttpServletRequest request,
            HttpServletResponse response) {
        this.defaultGetHandlers = defaultGetHandlers;
        this.defaultPostHandlers = defaultPostHandlers;
        this.request = request;
        this.response = response;
        if (request != null && (request.getMethod().equalsIgnoreCase("GET"))) {
            isGet = true;
        }
        if (isGet) {
            methodConfig = (MethodConfig) RequestServiceDelegate.serviceMethodConfig.get(request
                    .getParameter(HttpRequestHandler.SUPS_SERVICE)
                    + "." + request.getParameter(HttpRequestHandler.SUPS_METHOD));

            if (log.isDebugEnabled()) {
                log.debug("METHOD CONFIG FOR " + request.getParameter(HttpRequestHandler.SUPS_METHOD) + ":"
                        + methodConfig);
            }
        } else {
            methodConfig = (MethodConfig) RequestServiceDelegate.serviceMethodConfig.get(request
                    .getHeader(HttpRequestHandler.SUPS_SERVICE)
                    + "." + request.getHeader(HttpRequestHandler.SUPS_METHOD));
        }
    }

    public void resetOutputStream() {
        outputStream = new ByteArrayOutputStream();
    }

    public HttpServletResponse getResponse() {
        return response;
    }

    public HttpServletRequest getRequest() {
        return request;
    }

    public IRequestHandler getNextHandler() throws SystemException {
        initHandlerItr();

        if (handlerItr.hasNext()) {
            return (IRequestHandler) handlerItr.next();
        }

        return null;
    }

    public void addInfo(String key, Object value) {
        values.put(key, value);
    }

    public Object getInfo(String key) {
        return values.get(key);
    }

    public void setIsGet(boolean isGet) {
        this.isGet = isGet;
    }

    private void initHandlerItr() {
        if (handlerItr == null) {
            if ( isGet && (getRequest().getParameter("content") != null && !"".equals(getRequest().getParameter("content").trim()))){
                handlers =  new ArrayList();
                handlers.add(new ContentHandler());
            } else if (isGet && methodConfig != null) {
                handlers = methodConfig.getHandlerList();
            } else if (methodConfig != null) {
                handlers = methodConfig.postHandlerList();
            } 

            if (handlers != null && !handlers.isEmpty()) {
                handlerItr = handlers.iterator();
            } else {
                handleDefault();
            }
        }
    }

    public boolean isGet() {
        return isGet;
    }

    /**
     * @param methodConfig
     */
    public void setMethodConfig(MethodConfig methodConfig) {
        this.methodConfig = methodConfig;

    }

    public List getHandlers() {
        return handlers;
    }
   
    /**
     * @param ctx
     * @param request
     * @param response
     */
    public void handle() throws SystemException, BusinessException {

        initHandlerItr();

        IRequestHandler handler = getNextHandler();

        if (handler != null) {
            handler.handleRequest(this);
        }

        try {
             response.setContentType(getResponseMimeType());
             response.setContentLength(outputStream.size());
             
             if ( !headerDetails.isEmpty() )
             {
            	 Set set = headerDetails.entrySet();
            	 Iterator i = set.iterator();
            	 String key = null;
            	 String value = null;
            	 while (i.hasNext())
            	 {
            		 Map.Entry me = (Map.Entry)i.next();
            		 key = (String)me.getKey();
            		 value = (String)me.getValue();
            		 response.addHeader(key, value);
            	 }
             }
			 
             outputStream.writeTo(response.getOutputStream());
             response.getOutputStream().flush();
             response.getOutputStream().close();
        } catch (IOException e) {
            throw new SystemException("Problem writing and flushing the HTTP Response content", e);
        }

        // everything is finished and so we remove the session from the request
        HttpSession session = request.getSession(false); // do not create the
                                                            // session if it
                                                            // does not already
                                                            // exist

        // remove the session if it did exist
        if (session != null) {
            session.invalidate();
        }
    }

    private void handleDefault() {
        if (isGet()) {
            handlerItr = defaultGetHandlers.iterator();
        } else {
            handlerItr = defaultPostHandlers.iterator();
        }
    }
    public void setContentLength(int contentLength){
        if(this.contentLength == 0){
            this.contentLength = contentLength;
            outputStream = new ByteArrayOutputStream(contentLength);
        }
    }
    public int getContentLength(){
        return outputStream.size();
    }
    public ByteArrayOutputStream getOutputStream() {
        return outputStream;
    }

    /**
     * 
     */
    public MethodConfig getMethodConfig() {
        return methodConfig;
    }

    public String getResponseMimeType() {
        return responseMimeType;
    }

    public void setResponseMimeType(String responseMimeType) {
        this.responseMimeType = responseMimeType;
    }

    public void setResponseHeader(String headerName, String headerValue) {
    	headerDetails.put(headerName, headerValue);
    }

    public void writeOutput(String content) throws SystemException {
        try {
            getOutputStream().write(content.getBytes("UTF-8"));
        } catch (UnsupportedEncodingException e) {
            throw new SystemException("Unable to retrieve servcieResult", e);
        } catch (IOException e) {
            throw new SystemException("Unable to append servcieResult to output", e);
        }
    }
}
