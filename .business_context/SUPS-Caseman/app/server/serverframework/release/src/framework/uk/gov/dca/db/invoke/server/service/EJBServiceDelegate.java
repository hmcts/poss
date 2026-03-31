package uk.gov.dca.db.invoke.server.service;

import edu.emory.mathcs.backport.java.util.concurrent.ConcurrentHashMap;
import org.apache.commons.logging.Log;
import uk.gov.dca.db.SupsConstants;
import uk.gov.dca.db.ejb.ExceptionRewriter;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.invoke.server.service.request.CacheRequestContext;
import uk.gov.dca.db.invoke.server.service.request.RequestContext;
import uk.gov.dca.db.invoke.util.HomeManager;
import uk.gov.dca.db.util.ConfigUtil;
import uk.gov.dca.db.util.FrameworkConfigParam;
import uk.gov.dca.db.util.SUPSLogFactory;

import javax.ejb.CreateException;
import javax.ejb.EJBHome;
import javax.ejb.EJBObject;
import javax.naming.NameNotFoundException;
import javax.naming.NamingException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.rmi.ConnectException;
import java.rmi.NoSuchObjectException;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.Iterator;

/**
 * @author Imran Patel
 *
 */

public class EJBServiceDelegate
{
    
    private static final ExceptionRewriter m_exceptionRewriter = new ExceptionRewriter();    
    private static final Log log = SUPSLogFactory.getLogger(EJBServiceDelegate.class);
    private static HomeManager homeMgr = HomeManager.getInstance();
    private static ConcurrentHashMap instanceCache = new ConcurrentHashMap();
    private static final String EJB_CREATE = "create";
    private static final String NULL_ARGS_EXCEPTION = "Empty Parameter(s) Passed On for Processing : ";
    private static final Class[] AUTH_PARAM_CLASSES = new Class[]{String.class,String.class};
    private static final Class[] DEFAULT_PARAM_CLASSES = new Class[]{String.class,String.class,String.class};
    private static final String AUTHENTICATION_SERVICE_NAME = "Authentication";
    private static final String SECURITY_SERVICE_NAME = "Security";
    private static final String LOGIN_METHOD_NAME = "login";
    private static final String PING_METHOD_NAME = "ping";    
    private static final Class[] EMPTY_CLASS_ARRAY = new Class[0];
    private static final Object[] EMPTY_OBJECT_ARRAY = new Object[0];
    private static final String SERVICE_SUFFIX = "Service";
    private static final String JAVA_LANG_EXCEPTION = "Exception";
	private static final String EXCEPTION_MSG_DELIMITER = "|";
    private static final String EXCEPTION_CLASS_MSG_DELIMITER = "|";    
    private static ConfigUtil config = null;
    
    public static String processRequestRemote(RequestContext ctx)
    throws SystemException, BusinessException
    {
        long startTime = System.currentTimeMillis();
        
        try{
            config = ConfigUtil.create(FrameworkConfigParam.PROJECT_CONFIG.getValue());
        }
        catch(SystemException e){
            log.info("Unable to locate Project Configuration file: " + FrameworkConfigParam.PROJECT_CONFIG.getValue(), e);            
        }
        
        String result = null;
        EJBObject remoteInterface = null;
        
        try
        {
        	
        	if(!PING_METHOD_NAME.equalsIgnoreCase(ctx.targetMethod)){	        	   
	            final String validationResult = validateInput(ctx);
	        	if(validationResult != null)
	        	{
	        	    throw m_exceptionRewriter.rewrite( new BusinessException(validationResult));
	        	}
        	}
            try
            {
                String serviceJndiName = ctx.serviceName + SERVICE_SUFFIX;
                if(log.isDebugEnabled()){
                    log.debug("looking for bean with JNDI Name: " + ctx.serviceName + SERVICE_SUFFIX);
                }
                remoteInterface = getRemoteInterface(serviceJndiName);
                
                if((ctx.serviceName.equalsIgnoreCase(AUTHENTICATION_SERVICE_NAME) || 
                	ctx.serviceName.equalsIgnoreCase(SECURITY_SERVICE_NAME)) && 
                	ctx.targetMethod.equalsIgnoreCase(LOGIN_METHOD_NAME))
                {                           
                    if(!ctx.isSecure && enForceSSL())
                    {
                        throw m_exceptionRewriter.rewrite( new SystemException("This service may only be invoked over a secure connection"));
                    }
                	Method methodInstance = getMethodInstance(ctx, remoteInterface, AUTH_PARAM_CLASSES);                                            
                    result = (String) methodInstance.invoke(remoteInterface,new Object[]{ctx.user, ctx.password});
                    result = "<SupsSessionKey>" + result + "</SupsSessionKey>";
                    if(log.isDebugEnabled()){
                    	log.debug("<SupsSessionKey> successfully generated");
                    }
                }
                else if(ctx.targetMethod.equalsIgnoreCase(PING_METHOD_NAME)){
                	Method methodInstance = getMethodInstance(ctx, remoteInterface, EMPTY_CLASS_ARRAY);                                            
                    result = (String) methodInstance.invoke(remoteInterface, EMPTY_OBJECT_ARRAY);
                    log.info(result);
                }
                else
                {
                    Method methodInstance = getMethodInstance(ctx, remoteInterface, DEFAULT_PARAM_CLASSES);                                            
                    result = (String) methodInstance.invoke(remoteInterface,new Object[]{ctx.user, ctx.mac, ctx.requestPayload});
                    if(log.isDebugEnabled()){
                    	log.debug(result);
                    }
                }
            }
            catch (InvocationTargetException ie)
            {
                log.debug("InvocationTargetException: checking if it is a NoSuchObjectException");
                // it is highly unlikely this senario will ever be played out but
                // this is in adopting a 'bolt and braces' approach
                Throwable targetEx = ie.getTargetException();
                if(targetEx instanceof NoSuchObjectException)
                {
                    //this would be logged
                	instanceCache.put(ctx.serviceName,null);
                    remoteInterface = getRemoteInterface(ctx.serviceName);
                    if(ctx.serviceName.equalsIgnoreCase(AUTHENTICATION_SERVICE_NAME)&& ctx.targetMethod.equalsIgnoreCase(LOGIN_METHOD_NAME))
                    {
                        Method methodInstance = getMethodInstance(ctx, remoteInterface, AUTH_PARAM_CLASSES);                                
                        result = (String) methodInstance.invoke(remoteInterface,new Object[]{ctx.user, ctx.password});
                    }
                    else
                    {
                        Method methodInstance = getMethodInstance(ctx, remoteInterface, DEFAULT_PARAM_CLASSES);                                
                        result = (String) methodInstance.invoke(remoteInterface,new Object[]{ctx.user, ctx.mac, ctx.requestPayload});
                    }
                }
                else
                if(targetEx instanceof ConnectException)
                {
                    log.error("unable to connect to remote server");
                    throw new SystemException("Exception Occurred whilst connecting to remote server" + targetEx.getMessage(), targetEx);
                }
                else if(targetEx instanceof CreateException){
                	log.error("An EJB Create exception occured whilst instantiating EJB for the service");
                	throw new SystemException("An EJB Create exception occured whilst instantiating EJB for the service. "  +targetEx.getMessage(), targetEx);
                }
                // Rethrow the orginal exception.
                else
                {
                    throw ie;    
                }
            }
        }
        catch (IllegalArgumentException ex)
        {
            log.error(ex.getClass().getName() + ex.getMessage(), ex);
            throw new SystemException(resolveExceptionClassHierarchy(ex));             
        }
        catch (InvocationTargetException ie)
        {
            log.error(ie.getClass().getName() + ie.getMessage(), ie);
            Throwable cause = ie.getCause();
			if ( (cause != null) && (cause instanceof BusinessException)) 
			{
        	        throw (BusinessException) cause;
    		}
	        else if ( (cause != null) && (cause instanceof SystemException)) 
	        {
            	throw (SystemException) cause;
           	}
			else
			{
                if(ie.getMessage() == null)
                {
				    throw new SystemException(resolveExceptionClassHierarchy(ie.getTargetException()));
                }
                else
                {
				    throw new SystemException(resolveExceptionClassHierarchy(ie));
                }
			}
        }
        catch (NoSuchMethodException ne)
        {
            log.error(ne.getClass().getName() + ne.getMessage(), ne);
            throw new SystemException(resolveExceptionClassHierarchy(ne));             
        }
        catch (IllegalAccessException iae)
        {
            log.error(iae.getClass().getName() + iae.getMessage(), iae);
            throw new SystemException(resolveExceptionClassHierarchy(iae));             
        }
        catch(NameNotFoundException ex)
        {
            log.error(ex.getClass().getName() + ex.getMessage(), ex);
            throw new SystemException(resolveExceptionClassHierarchy(new ConfigurationException("Service not found: " + ctx.serviceName)));             
        }
        catch(NamingException ex)
        {
            log.error(ex.getClass().getName() + ex.getMessage(), ex);
            throw new SystemException(resolveExceptionClassHierarchy(ex));             
        }
        catch(ClassCastException ex)
        {
            log.error(ex.getClass().getName() + ex.getMessage(), ex);
            throw new SystemException(resolveExceptionClassHierarchy(ex));             
        }
        catch(RemoteException ex)
        {
            log.error(ex.getClass().getName() + ex.getMessage(), ex);
            throw new SystemException(resolveExceptionClassHierarchy(ex));             
        }
        catch(Exception ex)
        {
            log.error(ex.getClass().getName() + ex.getMessage(), ex);
            throw new SystemException(resolveExceptionClassHierarchy(ex));             
        }
        long timeElapsed = System.currentTimeMillis() - startTime;
        log.debug(ctx.user + ": processRequest took " + timeElapsed + " milli secs");
        return result;
    }

    /**
     * @return
     * @throws SystemException
     */
    private static boolean enForceSSL() throws SystemException {
        boolean forceSSL = true;
        try{
            if(config != null && config.get(SupsConstants.FORCE_USE_SSL_ID) != null){
                forceSSL = ((Boolean)config.get(SupsConstants.FORCE_USE_SSL_ID)).booleanValue() ;
            }
        }
        catch(SystemException e){
            if(log.isInfoEnabled()){
                log.info(SupsConstants.FORCE_USE_SSL_ID + " has not been defined");
            }
        }
        return forceSSL;
    }
    
    private static String validateInput(RequestContext ctx) 
    //throws IOException
    {
    	    ArrayList parameterNames = new ArrayList();
	        if(ctx.user == null)
	        {
	        	parameterNames.add("user");
	        }
	        if(ctx.serviceName == null)
	        {
	        	parameterNames.add("serviceName");
	        }
	        if(ctx.targetMethod == null)
	        {
	        	parameterNames.add("targetMethod");
	        }
	        if(ctx.serviceName != null && ctx.serviceName.equals(AUTHENTICATION_SERVICE_NAME))
	        {
	        	if(ctx.password == null)
	            {
	        		parameterNames.add("password");
	            }
	        }
	        if(ctx.serviceName != null && !ctx.serviceName.equals(AUTHENTICATION_SERVICE_NAME))
	        {
	        	if(ctx.mac == null)
	            {
	        		parameterNames.add("mac");
	            }
	        	if(ctx.requestPayload == null)
	            {
	        		parameterNames.add("requestPayload");
	            }
	        }
	        if(!parameterNames.isEmpty())
	        {	
	        	StringBuffer missingParams = new StringBuffer(NULL_ARGS_EXCEPTION);
	        	Iterator iter = parameterNames.iterator();
	        	while(iter.hasNext())
	        	{
	        		missingParams.append(iter.next() + ",");
	        	}
	        	return missingParams.toString();
	        }
    	return null;
    }


    private static EJBObject getRemoteInterface(String homeInterfaceName)
    throws RemoteException, ClassCastException,NamingException,SecurityException, 
    NoSuchMethodException,InvocationTargetException, IllegalArgumentException,
		IllegalAccessException
    {
        return loadRemoteInterface(homeInterfaceName);
    }
    
    private static EJBObject loadRemoteInterface(String homeInterfaceName)
    throws RemoteException, ClassCastException,NamingException,SecurityException, 
    NoSuchMethodException,InvocationTargetException, IllegalArgumentException,
		IllegalAccessException
    {
    	
        EJBObject remoteInterface = null;
        
        if((remoteInterface = (EJBObject)instanceCache.get(homeInterfaceName)) == null)
        {
            EJBHome ejbHome = homeMgr.lookup(homeInterfaceName);
            Method methodInstance = ejbHome.getClass().getDeclaredMethod(EJB_CREATE,EMPTY_CLASS_ARRAY );
            remoteInterface = (EJBObject)methodInstance.invoke (ejbHome, EMPTY_OBJECT_ARRAY);
            instanceCache.put(homeInterfaceName,remoteInterface);
        }
        return remoteInterface;
    }
    
    private static void loadMethodInstances(Object remoteInterface,
    		String serviceName,	String targetMethod)
    throws SecurityException, NoSuchMethodException
    {
        String serviceInvocation = serviceName + targetMethod;
        Class[] parameterClasses = null;
        Method methodInstance = null;
        
        parameterClasses = (
        		(serviceName.equalsIgnoreCase(AUTHENTICATION_SERVICE_NAME) ||
        		serviceName.equalsIgnoreCase(SECURITY_SERVICE_NAME)) && 
        		targetMethod.equalsIgnoreCase(LOGIN_METHOD_NAME))? AUTH_PARAM_CLASSES : DEFAULT_PARAM_CLASSES;
        
        if((methodInstance = (Method)instanceCache.get(serviceInvocation)) == null){        	
        	methodInstance = remoteInterface.getClass().getDeclaredMethod(targetMethod, parameterClasses);
      		instanceCache.put(serviceInvocation, methodInstance);
        }
    }


    private static Method getMethodInstance(RequestContext ctx, Object remoteInterface, Class[] parameterClasses)
    	throws SecurityException, NoSuchMethodException
    {
        long startTime = 0;
        if ( log.isDebugEnabled() ) {
        	startTime = System.currentTimeMillis();
        }
        
        String serviceInvocation = ctx.serviceName + ctx.targetMethod;
        Method methodInstance = null;
        if((methodInstance = (Method)instanceCache.get(serviceInvocation)) == null)
        {
            methodInstance = remoteInterface.getClass().getDeclaredMethod(
            		ctx.targetMethod, parameterClasses);
            instanceCache.put(serviceInvocation, methodInstance);
        }
        
        if (log.isDebugEnabled())
        {
        	long timeElapsed = System.currentTimeMillis() - startTime;
        	log.debug(ctx.threadName + " : getMethodInstance took " + timeElapsed + " milli secs");
        }
        
        return methodInstance;
    }
    
    public static void loadCaches() throws SystemException
    {
    	ServiceMetaData serviceMetaData = ServiceMetaDataImpl.getInstance();
    	String[] serviceNames = serviceMetaData.getServices();
    	String[] serviceMethodNames = null;
    	String serviceName = null;
    	EJBObject remoteInterface =  null;
    	try
    	{
	    	for(int count = 0; count < serviceNames.length; count++)
	    	{
	    		serviceName = (String)serviceNames[count];
	    		remoteInterface = loadRemoteInterface( serviceName + SERVICE_SUFFIX);
	    		serviceMethodNames = serviceMetaData.getServiceMethods(serviceName);
	    		
	    		RequestContext ctx = new CacheRequestContext(serviceName, PING_METHOD_NAME);
	    		try {
					processRequestRemote(ctx);
				} catch (SystemException e) {
		            log.error(e.getClass().getName() + e.getMessage());
				} catch (BusinessException e) {
		            log.error(e.getClass().getName() + e.getMessage());
				}
	    		
	    		for(int mi=0; mi < serviceMethodNames.length; mi++)
	    		{
	    			try {
						loadMethodInstances(remoteInterface,serviceName,serviceMethodNames[mi]);
	    			}
	    	    	catch (NoSuchMethodException ne)
	    	        {
	    	            log.error(ne.getClass().getName() + ne.getMessage());
	    	        }
	    	        catch(ClassCastException ex)
	    	        {
	    	            log.error(ex.getClass().getName() + ex.getMessage());
	    	        }
	    		}
	    	}
    	}
    	catch (InvocationTargetException ie)
        {
            log.error(ie.getClass().getName() + ie.getMessage());
        }
    	catch (NoSuchMethodException ne)
        {
            log.error(ne.getClass().getName() + ne.getMessage());
        }
        catch (IllegalAccessException iae)
        {
            log.error(iae.getClass().getName() + iae.getMessage());
        }
        catch(NamingException ex)
        {
            log.error(ex.getClass().getName() + ex.getMessage());
        }
        catch(ClassCastException ex)
        {
            log.error(ex.getClass().getName() + ex.getMessage());
        }
        catch(RemoteException ex)
        {
            log.error(ex.getClass().getName() + ex.getMessage());
        }
        log.info("********* cach loading completed ***********");
    }
    
    
    /**
     * Resolves the exception hierarchy into a string using the format: -
     * BaseClassName|ChildClassName|ChildClassName|ExceptionMessage
     * 
     * @param exClass
     * @return
     */
    private static String resolveExceptionClassHierarchy(Object exClass) 
	{
		Class exceptionClass = exClass.getClass();
		String superclassName = exceptionClass.getName();
		superclassName = superclassName.substring(superclassName.lastIndexOf('.') + 1);
		StringBuffer exceptionDetails = new StringBuffer();
		while(!superclassName.equals(JAVA_LANG_EXCEPTION)) 
		{
			exceptionDetails.insert(0,  superclassName + EXCEPTION_CLASS_MSG_DELIMITER);
			exceptionClass = exceptionClass.getSuperclass();
			superclassName = exceptionClass.getName();
			superclassName = superclassName.substring(superclassName.lastIndexOf('.') + 1);
		}
		exceptionDetails.append(EXCEPTION_CLASS_MSG_DELIMITER + ((Exception)exClass).getMessage());
		return exceptionDetails.toString();
	}

    /**
	 * @param ctx
	 * @return
	 */
	public static String processRequestLocal(RequestContext ctx) {
		// TODO Auto-generated method stub
		return null;
	}

    
}
