/*
 * Created on 06-Jul-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.transformation.common.web_delegator.impl;

import uk.gov.dca.transformation.common.web_delegator.IWebServiceObject;

/**
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class WebServiceObject implements IWebServiceObject {
    
    private static final String WEB_SERVICE_OBJECT_TAG = "WebServiceObject";
    private static final String SERVICE_NAME = "ServiceName";
    private static final String METHOD_NAME = "MethodName";
    private static final String USER_NAME = "UserName";
    private static final String PASSWORD = "Password";
    private static final String SERVICE_ENDPOINT = "ServiceEndPoint";
    private static final String WEB_SERVICE_NAME = "WebServiceName";
    private static final String WEB_SERVICE_METHOD_NAME = "WebServiceMethodName";
    
    
    private String serviceName;
    private String methodName;
    private String userName;
    private String password;
    private String serviceEndPoint;
    private String webServiceName;
    private String webServiceMethodName;
    
    public WebServiceObject() {
        
    }
    
    public String getServiceName() {
        return serviceName;
    }
    
    public String getMethodName() {
        return methodName;
    }
    
    public String getUserName() {
        return userName;
    }
    
    public String getPassword() {
        return password;
    }
    
    public String getServiceEndPoint() {
        return serviceEndPoint;
    }
    
    public String getWebServiceName() {
        return webServiceName;
    }
    
    public String getWebServiceMethodName() {
        return webServiceMethodName;
    }
    
    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public void setMethodName(String methodName) {
        this.methodName = methodName;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public void setServiceEndPoint(String serviceEndPoint) {
        this.serviceEndPoint = serviceEndPoint;
    }
    
    public void setWebServiceName(String webServiceName) {
        this.webServiceName = webServiceName;
    }
    
    public void setWebServiceMethodName(String webServiceMethodName) {
        this.webServiceMethodName = webServiceMethodName;
    }
    
    public boolean equals(Object obj) {
        if(obj == this) {
            return true;
        } else if (!(obj instanceof WebServiceObject)) {
            return false;
        }
        
        WebServiceObject objType = (WebServiceObject)obj;
        if(serviceName != null && (!serviceName.equals(objType.serviceName))) {
            return false;         
        } else if(methodName != null && (!methodName.equals(objType.methodName))) {
            return false;         
        } else if(userName != null && (!userName.equals(objType.userName))) {
            return false;         
        } else if(password != null && (!password.equals(objType.password))) {
            return false;         
        } else if(serviceEndPoint != null && (!serviceEndPoint.equals(objType.serviceEndPoint))) {
            return false;         
        } else if(webServiceName != null && (!webServiceName.equals(objType.webServiceName))) {
            return false;         
        } else if(webServiceMethodName != null && (!webServiceMethodName.equals(objType.webServiceMethodName))) {
            return false;         
        }
        return true;
    }
    
    public int hashCode() {
        int result = 17;
        if(serviceName != null) {
            result = 37 * result + (serviceName.hashCode());
        }
        if(methodName != null) {
            result = 37 * result + (methodName.hashCode());
        }
        if(userName != null) {
            result = 37 * result + (userName.hashCode());
        }
        if(password != null) {
            result = 37 * result + (password.hashCode());
        }
        if(serviceEndPoint != null) {
            result = 37 * result + (serviceEndPoint.hashCode());
        }
        if(webServiceName != null) {
            result = 37 * result + (webServiceName.hashCode());
        }
        if(webServiceMethodName != null) {
            result = 37 * result + (webServiceMethodName.hashCode());
        }
        return result;
    }
    
    public String toString() {
        return ("[" + WEB_SERVICE_OBJECT_TAG+ " OBJECT = \n"  +
                SERVICE_NAME + " = " + serviceName +  "," +
                METHOD_NAME + " = " + methodName +  "," +
                USER_NAME + " = " + userName +  "," +
                PASSWORD + " = " + password +  "," +
                SERVICE_ENDPOINT + " = " + serviceEndPoint +  "," +
                WEB_SERVICE_NAME + " = " + webServiceName +  "," +
        		WEB_SERVICE_METHOD_NAME + " = " + webServiceMethodName + "]");  
    }
    
}
