/*
 * Created on 09-Nov-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.ejb;

import org.apache.commons.logging.Log;
import uk.gov.dca.db.util.ClassUtil;
import uk.gov.dca.db.util.SUPSLogFactory;

import javax.ejb.EJBLocalHome;
import javax.naming.Binding;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
 
/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class ServiceLocator {

	/**
	 * Private constructor to prevent direct instantiation by clients.
	 */
	private ServiceLocator() {
		super();
	}

	/**
	 * Retrieves the instance of the service locator.
	 * 
	 * @return the Singleton instance of the ServiceLocator
	 */
	public static ServiceLocator getInstance() {
		return instance;
	}
	
	/**
	 * 
	 * @param localInterface
	 * @return
	 * @throws ServiceLocatorException
	 */
	public Object getService(Class localInterface) throws ServiceLocatorException {
		Object service = null;
		
		log.debug("getService(Class): Looking up JNDI name of EJB in cache: " + localInterface);
		String jndiName = (String) cache.get(localInterface);
		
		if(jndiName == null) {
			StringBuffer className = new StringBuffer(localInterface.getName());
			className.append(LOCAL_HOME_INTERFACE_SUFFIX);
			Class homeInterface = null;
			
			try {
				homeInterface = ClassUtil.loadClass(className.toString());
			}
			catch(ClassNotFoundException e) {
				throw new ServiceLocatorException("Could not find corresponding home interface for specified local interface '" + localInterface+"'", e);
			}
			
			if(log.isDebugEnabled()) {
				StringBuffer msg = new StringBuffer("getService(Class): Home interface for ");
				msg.append(localInterface);
				msg.append(" = ");
				msg.append(className);
				log.debug(msg.toString());
			}
			
			if(homeInterface == null) {
				throw new ServiceLocatorException("Could not load service's home interface: " + className.toString());
			}
			
			Field jndiNameField = null;
			try {
				jndiNameField =  homeInterface.getDeclaredField(JNDI_NAME_FIELD_NAME);
			}
			catch(NoSuchFieldException e) {
				throw new ServiceLocatorException(JNDI_NAME_FIELD_NAME + " was not declared in the corresponding home interface for '"+localInterface+"'", e);
			}
			
			try {
				jndiName = (String) jndiNameField.get(null);
			}
			catch(IllegalAccessException e) {
				throw new ServiceLocatorException("Failed whilst trying to ascertain JNDI name of home interface entry in the JNDI tree for '" + localInterface+"'", e);
			}
			
			cache.put(localInterface, jndiName);
		}
		
		if(log.isDebugEnabled()) {
			StringBuffer msg = new StringBuffer("getService(Class): JNDI name of home interface for ");
			msg.append(localInterface);
			msg.append(" = ");
			msg.append(jndiName);
			log.debug(msg.toString());
		}
			
		service = getService(jndiName);
		
		return service;
	}
	
	/**
	 * 
	 * @param jndiName
	 * @return
	 * @throws ServiceLocatorException
	 */
	public Object getService(String jndiName) throws ServiceLocatorException {
		Object service = null;
		
		try {
			
			log.debug("getService(String): Looking up EJB home interface in cache: " + jndiName);
			EJBLocalHome home = (EJBLocalHome) cache.get(jndiName);
			
			if(home == null) {
				if(log.isDebugEnabled()){
                    log.debug("getService(String): Looking up EJB home interface in JNDI: java:comp/env/" + jndiName);
                }

				Context context = createContext();
				Object obj = context.lookup(jndiName);
				if(log.isDebugEnabled()){
                    log.debug("getService(String): got Home interface - " + obj.getClass().getName());
                }

				home = (EJBLocalHome) obj;
				cache.put(jndiName, home);
			}
				
			log.debug("getService(String): Creating EJB: " + jndiName);
			Method createMethod = home.getClass().getMethod(CREATE_METHOD_NAME, new Class[0]);
			if(createMethod == null) {
				throw new ServiceLocatorException("Could not load create method for home interface: " + home.getClass().getName());
			}
		    service = createMethod.invoke(home, new Object[0]);
		}
		catch(NamingException e) {
			throw new ServiceLocatorException("Failed whilst attempting to lookup Home interface with JNDI name '" + jndiName+"'", e);
		}
		catch(NoSuchMethodException e) {
			throw new ServiceLocatorException("Could not find a create() method for the home interface with JNDI name '" + jndiName+"'", e);
		} 
		catch (IllegalArgumentException e) {
			throw new ServiceLocatorException("Failed whilst trying to execute create() method for the home interface with JNDI name '" + jndiName+"'", e);
		} 
		catch (IllegalAccessException e) {
			throw new ServiceLocatorException("Failed whilst trying to execute create() method for the home interface with JNDI name '" + jndiName+"'", e);
		} 
		catch (InvocationTargetException e) {
			throw new ServiceLocatorException("An exception occured whilst executing the create() method for the home interface with JNDI name '" + jndiName+"'", e);
		}
		
		return service;
	}
	
	/**
	 * Does a general cache lookup of an object.
	 * 
	 * @param jndiName
	 * @return
	 * @throws ServiceLocatorException
	 */
	public Object get(String jndiName) throws ServiceLocatorException
	{
		Object service = null;
        service = cache.get(jndiName);
        
        if (service == null) {
            InitialContext ic = null;
            try {

                log.debug("getService(String): Looking up Object in JNDI: " + jndiName);
                ic = new InitialContext();
                service = ic.lookup(jndiName);
                cache.put(jndiName, service);
            } catch (NamingException e) {
                if(log.isInfoEnabled()){
                    log.info("Unable to locate object in JNDI with name: '" + jndiName + "' in JNDI; will create full context and look there");
                }
            }
            finally
            {
                if(ic != null)
                {
                    try
                    {
                        ic.close();
                    }
                    catch (NamingException e)
                    {
                        if(log.isErrorEnabled())
                        {
                            log.error("Unable to close InitialContext");
                        }
                    }
                }
            }
        }
        if (service == null) {
            Context context = null;
            try {
                if(log.isDebugEnabled()){
                    log.debug("getService(String): Looking up Object in context from createContext(): "+ jndiName);
                }
                context = createContext();
                service = context.lookup(jndiName);
                cache.put(jndiName, service);
            } catch (NamingException e) {
                throw new ServiceLocatorException("Failed while attempting to lookup Object with JNDI name '"+ jndiName + "'", e);
            }
            finally
            {
                if(context != null)
                {

                    try
                    {
                        context.close();
                    }
                    catch (NamingException e)
                    {
                        if(log.isErrorEnabled())
                        {
                            log.error("Unable to close Context");
                        }
                    }
                }
            }
        }

		return service;
	    
	}

	private Context createContext() throws NamingException {
		Context product = new InitialContext();
		if(!BYPASS_LOCAL_LOOKUP) {
			product = (Context) product.lookup("java:comp/env");
		}
		
		// print the contents of the JNDI tree
		printTree(product, product, "", "");
		
		return product;
	}

	private void printTree(Context c,Context subContext, String contextName, String prefix) throws NamingException {
  
		NamingEnumeration ne = c.listBindings(contextName);
	      
	    while (ne.hasMore()) {
	    	Binding b = (Binding)ne.next();
	    	Object boundObject = b.getObject();
	    	String name = b.getName();
	    	log.info(prefix + name + " -> [" + b.getClassName() + "]");	      
	    	if (boundObject instanceof Context) {
	    		printTree(subContext, (Context) boundObject, name, prefix + name + '/');
	    	} 
	    }
	}

	
	private static final String LOCAL_HOME_INTERFACE_SUFFIX = "LocalHome";
	private static final String JNDI_NAME_FIELD_NAME = "JNDI_NAME";
	private static final String CREATE_METHOD_NAME = "create";
	private static final boolean BYPASS_LOCAL_LOOKUP = false;
	
	private static final Log log = SUPSLogFactory.getLogger(ServiceLocator.class);
	
	// Singleton instance
	private static ServiceLocator instance = new ServiceLocator();

	private Map cache = new HashMap();
}