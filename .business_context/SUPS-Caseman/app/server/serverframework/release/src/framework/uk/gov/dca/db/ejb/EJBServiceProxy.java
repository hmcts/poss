/*
 * Created on 30-Jul-2004
 *
 */
package uk.gov.dca.db.ejb;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import javax.ejb.EJBHome;
import javax.ejb.EJBLocalObject;
import javax.ejb.EJBObject;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ExceptionUtil;
import uk.gov.dca.db.exception.SystemException;

/**
 * @author Michael Barker
 *
 * Utility class for EJBs.
 * 
 * TODO: This class is not performant.  Look at caching InitialContext, Home and Methods.
 * TODO: Think about better design (Factory & non-static methods).
 * 
 */
public class EJBServiceProxy
{

    /**
     * Dynamically invoke a local stateless session EJB
     * 
     * @param jndiName The JNDI name of the bean to query.
     * @param methodName The method of the EJB to invoke.
     * @param paramTypes The class portion of the method signature.
     * @param params The parameters for the call.
     * @return The result.
     * @throws SystemException
     */
    public static Object invokeLocal(String jndiName, String methodName, Class[] paramTypes, Object[] params)
    	throws SystemException, BusinessException
    {
        EJBLocalObject bean = null;
        Method bizMethod = null;
        Object result = null;
        
        ServiceLocator locator = ServiceLocator.getInstance();
        bean = (EJBLocalObject) locator.getService(jndiName);
        
	    try {
	    	bizMethod = bean.getClass().getMethod(methodName, paramTypes);
	    }
    	catch(NoSuchMethodException e) {
        	throw new SystemException("Failed to find local service method '"+jndiName+"."+methodName+"'",e);
        }
	      
    	try {
    		result = bizMethod.invoke(bean, params);
    	}
    	catch(IllegalAccessException e) {
    		throw new SystemException("Failed to invoke local service method '"+jndiName+"."+methodName+"'",e);
        }
    	catch(InvocationTargetException e) {
    		Throwable cause = e.getCause();
            ExceptionUtil.rethrow(cause, "Failed to invoke local service method '"+jndiName+"."+methodName+"'");
        }
    	
	    return result;
    }
    
    /**
     * Dynamically invoke a remote EJB interface.
     * 
     * @param jndiName The JNDI name of the bean to query.
     * @param methodName The method of the EJB to invoke.
     * @param paramTypes The class portion of the method signature.
     * @param params The parameters for the call.
     * @return The result.
     * @throws SystemException
     */
    public static Object invoke(String jndiName, String methodName, Class[] paramTypes, Object[] params)
    	throws SystemException, BusinessException
    {
    	InitialContext ic = null;
    	EJBHome home = null;
    	Method createMethod = null;
    	EJBObject bean = null;
        Method bizMethod = null;
        Object result = null;
        
    	try {
	        ic = new InitialContext();
	        home = (EJBHome) ic.lookup(jndiName);
    	}
	    catch(NamingException e){
	    	throw new SystemException("Failed to find remote service '"+jndiName+"'",e);
	    }
	        
	    try {
	    	createMethod = home.getClass().getMethod("create", new Class[0]);
	    }
    	catch(NoSuchMethodException e) {
        	throw new SystemException("Failed to find remote service method '"+jndiName+".create'",e);
        }
    	
	    try {
	    	bean = (EJBObject) createMethod.invoke(home, new Object[0]);
	    }
    	catch(IllegalAccessException e) {
    		throw new SystemException("Failed to invoke remote service method '"+jndiName+".create'",e);
        }
    	catch(InvocationTargetException e) {
    		throw new SystemException("Failed to invoke remote service method '"+jndiName+".create'",e);
        }
    	
	    try {
	    	bizMethod = bean.getClass().getMethod(methodName, paramTypes);
	    }
    	catch(NoSuchMethodException e) {
        	throw new SystemException("Failed to find remote service method '"+jndiName+"."+methodName+"'",e);
        }
	      
    	try {
    		result = bizMethod.invoke(bean, params);
    	}
    	catch(IllegalAccessException e) {
    		throw new SystemException("Failed to invoke remote service method '"+jndiName+"."+methodName+"'",e);
        }
    	catch(InvocationTargetException e) {
    		Throwable cause = e.getCause();
            ExceptionUtil.rethrow(cause, "Failed to invoke local service method '"+jndiName+"."+methodName+"'");
        }
    	
	    return result;
    }    

}
