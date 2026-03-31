/*
 * Created on 01-Jul-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.transformation.common.bean_delegator.impl;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import javax.ejb.EJBHome;
import javax.ejb.EJBObject;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.transformation.common.bean_delegator.IBeanServiceDelegator;
import uk.gov.dca.transformation.common.config.ConfigManager;


/**
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class BeanServiceDelegator implements IBeanServiceDelegator {
	private static final Log log = LogFactory.getLog(BeanServiceDelegator.class);
		
	public BeanServiceDelegator() {  
	}
	
	/*
	 * There is only one type of Params which is String XML
	 */
    public String invokeBeanService(String jndiName, String methodName, String params) throws SystemException, BusinessException
    {   	
        log.debug("Jndi Bean Name = " + jndiName);
        log.debug("Method Name = " + methodName);
        log.debug("Params = " + params);
    	try { 	    
    	    Context ic = new InitialContext(ConfigManager.getInstance().getJndiHash());
    	    EJBHome home = (EJBHome) ic.lookup(jndiName); 	    
    	    Method createMethod = home.getClass().getMethod("create", new Class[0]);
    	    EJBObject beanObj = (EJBObject) createMethod.invoke(home, new Object[0]);
	        return checkResponseForFaultCodes(beanObj.getClass().getMethod(methodName, new Class[] {String.class, String.class, String.class}).invoke(beanObj, new Object[] {"", "", params}));        
    	}
	    catch(NamingException e){
	        log.error("Naming Exception caught in " + this.getClass().getName(), e);
	        throw new SystemException("Wrapped Naming Exception caught in '"+jndiName+"'",e);
	    } catch (SecurityException e) {
	        log.error("Naming Exception caught in " + this.getClass().getName(), e);
	        throw new SystemException("Wrapped Naming Exception caught in '"+jndiName+"'",e);
        } catch (NoSuchMethodException e) {
	        log.error("Naming Exception caught in " + this.getClass().getName(), e);
	        throw new SystemException("Wrapped Naming Exception caught in '"+jndiName+"'",e);
        } catch (IllegalArgumentException e) {
	        log.error("Naming Exception caught in " + this.getClass().getName(), e);
	        throw new SystemException("Wrapped Naming Exception caught in '"+jndiName+"'",e);
        } catch (IllegalAccessException e) {
	        log.error("IllegalAccess Exception caught in " + this.getClass().getName(), e);
	        throw new SystemException("Wrapped IllegalAccess Exception caught in '"+jndiName+"'",e);
        } catch (InvocationTargetException e) {
    		Throwable cause = e.getCause();
    		
    		if ( cause != null && cause instanceof BusinessException) 
    		{
        		throw (BusinessException)cause;
    		}
    		if ( cause != null && cause instanceof SystemException ) 
    		{
        		throw (SystemException)cause;
    		}
    		
    		throw new SystemException("Failed to invoke remote service method '"+jndiName+"."+methodName+"'",e);
        }    
    }
    
    private String checkResponseForFaultCodes(Object response) throws SystemException {
        //TO DO AS FAULT CODES NEED TO BE CODED AS YET
        if(response instanceof String) {
            log.debug("Response = \n" + response);
            return (String) response;
        } else {
            log.debug("Response is not a String and is " + response.getClass().getName());
            return "";
        }

    }
   
}
