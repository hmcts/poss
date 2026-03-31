/*
 * Created on 01-Jul-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.transformation.common.web_delegator.impl;

import java.net.MalformedURLException;
import java.net.URL;
import java.rmi.RemoteException;

import javax.xml.rpc.ServiceException;

import org.apache.axis.client.Call;
import org.apache.axis.client.Service;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.security.EncodingException;
import uk.gov.dca.db.security.SecurityContext;
import uk.gov.dca.db.security.SecurityFactory;
import uk.gov.dca.transformation.common.config.ConfigManager;
import uk.gov.dca.transformation.common.web_delegator.IWebServiceDelegator;
import uk.gov.dca.transformation.common.web_delegator.IWebServiceObject;


/**
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class WebServiceDelegator implements IWebServiceDelegator {
	private static final Log log = LogFactory.getLog(WebServiceDelegator.class);
	
	private IWebServiceObject webObj;
	private String applicationServerName;
	private String applicationMethodName;
	
	public WebServiceDelegator(String applicationServerName, String applicationMethodName) {  
	    this.applicationServerName = applicationServerName;
	    this.applicationMethodName  = applicationMethodName;
	    webObj = ConfigManager.getInstance().getWebServiceObject(applicationServerName+applicationMethodName);
	}

    public String invokeWebService(String params) throws SystemException
    {
        log.debug("Server Name = " + applicationServerName);
        log.debug("Method Name = " + applicationMethodName);
        log.debug("Params = " + params);
        
        Service service = new Service();           
        try {
            Call call = (Call)service.createCall();
        	// http://localhost:8080/caseman/Bms/BmsServiceServicePort
            //URL+Bms+Bms+ServiceServicePort
	        call.setTargetEndpointAddress(new URL(webObj.getServiceEndPoint() + webObj.getWebServiceName() + "/" + webObj.getWebServiceName() + "ServiceServicePort"));
	        call.setOperationName(webObj.getWebServiceMethodName());
	        call.setUsername(webObj.getUserName());
	        call.setPassword(webObj.getPassword());
	        call.setTimeout(new Integer(120000));
	        SecurityFactory factory = new SecurityFactory();
	        SecurityContext context = factory.createSecurityContext();
	        String mac = context.getMac(webObj.getUserName(), params);
	        System.out.println("Operation name =  " + call.getOperationName());

	        return checkResponseForFaultCodes((String)call.invoke(new Object[] {webObj.getUserName(), mac, params}));	    	        
        } catch (ServiceException se) {
            log.error("Service Exception caught in " + this.getClass().getName(), se);
            throw new SystemException("Wrapped Service Exception caught in " + this.getClass().getName(), se);
	    } catch (MalformedURLException mue) {
	        log.error("Malformed URLException caught in " + this.getClass().getName(), mue);
            throw new SystemException("Wrapped Malformed URLException caught in " + this.getClass().getName(), mue);
	    } catch (EncodingException ee) {
	        log.error("Encoding Exception caught in " + this.getClass().getName(), ee);
            throw new SystemException("Wrapped Encoding Exception caught in " + this.getClass().getName(), ee);
	    } catch (RemoteException re) {
	        log.error("Remote Exception caught in " + this.getClass().getName(), re);
            throw new SystemException("Wrapped Remote Exception caught in " + this.getClass().getName(), re);
        }
    }
    
    private String checkResponseForFaultCodes(String response) throws SystemException {
        //TO DO AS FAULT CODES NEED TO BE CODED AS YET
        log.debug("Response = \n" + response);
        System.out.println("\n\n\n RESPONSE = " + response);
        return response;
    }
    
}
