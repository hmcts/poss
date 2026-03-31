/*
 * Created on 27-Jul-2004
 *
 */
package uk.gov.dca.test_project;

import java.rmi.RemoteException;

import javax.ejb.CreateException;
import javax.ejb.EJBException;
import javax.ejb.SessionContext;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import uk.gov.dca.db.security.SecurityService;
import uk.gov.dca.db.security.InvalidUserSessionException;
import uk.gov.dca.db.security.SecurityServiceLocalHome;
import uk.gov.dca.db.ejb.ServiceLocator;
import uk.gov.dca.db.ejb.ServiceLocatorException;
import uk.gov.dca.db.XMLService;
import uk.gov.dca.db.XMLServiceFactory;
import uk.gov.dca.db.ejb.ExceptionRewriter;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ComponentContext;
import uk.gov.dca.db.security.AuthorizationException;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;
import uk.gov.dca.db.util.SUPSLogEvent;
import uk.gov.dca.db.util.SUPSLogFactory;
import java.io.Writer;
import java.io.IOException;
import org.jdom.Document;

/**
 * @ejb.bean type="Stateless"
 * 			 name="EchoService"
 *           jndi-name="EchoService"
 *			 local-jndi-name="ejb/EchoServiceLocal"
 *           view-type="${ejb.interfaces}"
 *
 * @ejb.interface service-endpoint-class="uk.gov.dca.test_project.EchoServiceService"
 *
 * @ejb.ejb-ref ejb-name="EchoService"
 *				view-type="local"
 *				ref-name="ejb/EchoServiceLocal"
 *
 * @ejb.ejb-external-ref view-type="local"
 *						 type="Session"
 *						 ref-name="ejb/SecurityServiceLocal"
 *						 home="uk.gov.dca.db.security.SecurityServiceLocalHome"
 *						 business="uk.gov.dca.db.security.SecurityService"
 *						 link="SecurityService"
 *
 * @ejb.ejb-external-ref view-type="local"
 *						 type="Session"
 *						 ref-name="ejb/CommandProcessorLocal"
 *						 home="uk.gov.dca.db.impl.command.CommandProcessorLocalHome"
 *						 business="uk.gov.dca.db.impl.command.CommandProcessor"
 *						 link="CommandProcessor"
 *
 * @oc4j.bean jndi-name="EchoService" pool-cache-timeout="0"
 *
 * @wsee.port-component name="EchoServiceServicePort"
 * @jboss-net.web-service urn = "Echo"
 * @jboss-net.authentication domain="other" validate-unauthenticated-calls="true"
 * jboss-net.authorization domain="other" roles-allowed="user"
 *
 * @soap.service urn="Echo"
 *
 * @author Michael Barker
 *
 */
public class EchoBean implements javax.ejb.SessionBean
{

	/**
	 * EJB lifecycle method called when the bean instance is created.
	 * 
	 * @ejb.create-method
 	 * @ejb.permission role-name="user"
 	 *
	 * @throws CreateException
	 */
	public void ejbCreate() throws CreateException
    {
        try {
        	initialise();
        }
        catch(SystemException e) {
        	baseLog.error("Error occurred on creation of bean", e);
        	throw new CreateException("Failed to initialise service: "+e.getMessage());
        }
    }
        
    /* (non-Javadoc)
     * @see javax.ejb.SessionBean#setSessionContext(javax.ejb.SessionContext)
     */
    public void setSessionContext(SessionContext ctx) throws EJBException, RemoteException
    {
        this.ctx = ctx;
    }

    /* (non-Javadoc)
     * @see javax.ejb.SessionBean#ejbRemove()
     */
    public void ejbRemove() throws EJBException, RemoteException
    {
        // TODO Auto-generated method stub
        
    }

    /* (non-Javadoc)
     * @see javax.ejb.SessionBean#ejbActivate()
     */
    public void ejbActivate() throws EJBException, RemoteException
    {
        try {
        	initialise();
        }
        catch(SystemException e) {
        	baseLog.error("Error occurred on activation of bean", e);
        	throw new EJBException("Failed to initialise service: "+e.getMessage());
        }
    }

    /* (non-Javadoc)
     * @see javax.ejb.SessionBean#ejbPassivate()
     */
    public void ejbPassivate() throws EJBException, RemoteException
    {
        service = null;
    }
    
    /**
     * @wlws:exclude
     */
    public String[] getMethods()
    {
        return METHODS;
    }
    
    private final static String SERVICE_NAME = "Echo";
    private final static String PROJECT_FILE = "uk/gov/dca/test_project/project_config.xml";
    private final static String FRAMEWORK_CONFIG_FILE = "uk/gov/dca/test_project/sups_config.xml";
    private final static String[] METHODS = {
        "uk/gov/dca/test_project/echo_service/methods/http_cache_end_of_day.xml","uk/gov/dca/test_project/echo_service/methods/http_cache_ten_days.xml","uk/gov/dca/test_project/echo_service/methods/http_cache_ten_mins.xml","uk/gov/dca/test_project/echo_service/methods/http_cache_ten_hours.xml","uk/gov/dca/test_project/echo_service/methods/http_post.xml","uk/gov/dca/test_project/echo_service/methods/http_cache_ten_secs.xml","uk/gov/dca/test_project/echo_service/methods/http_get.xml"
    };
    private static final Log log = SUPSLogFactory.getLogger(EchoBean.class);
    
	/**
	 * @wlws:exclude
	 */
	public String getFrameworkConfigFile()
	{
		return FRAMEWORK_CONFIG_FILE;
	}

	/**
	 * @wlws:exclude
	 */
	public String getProjectConfigFile()
	{
		return PROJECT_FILE;
	}

	/**
	 * @wlws:exclude
	 */
	public String getServiceName()
	{
		return SERVICE_NAME;
	}

	
	protected void authenticate(String user, String mac, String params) throws BusinessException, SystemException {
    	try {
    		String status = (String) service.getApplicationRegistry().get("security:status");
            	        	
    	       	// validate the message authentication code sent with the message to check if the message is from a valid user with an active
    	       	// session
    	       	SecurityService security = (SecurityService) ServiceLocator.getInstance().getService(SecurityService.class);
    	       	if(!security.validateMAC(user, mac, params) && (status == null || !status.toUpperCase().equals("INACTIVE"))) {
    	       		throw new InvalidUserSessionException("Failed validation of message authentication code");
    	       	}
    	}
        catch(ServiceLocatorException e) {
         	throw new SystemException("Service failed whilst trying to validate user session: " + e.getMessage(), e);
        }
    }
    
    protected void authorize(String securityInfo, IComponentContext context) throws BusinessException, SystemException {
    	String status = (String) service.getApplicationRegistry().get("security:status");

    	       	// validate the message authentication code sent with the message to check if the message is from a valid user with an active
    	       	// session
	       	SecurityService security = (SecurityService) ServiceLocator.getInstance().getService(SecurityService.class);
	       	if(!security.authorize(securityInfo, context) && (status == null || !status.toUpperCase().equals("INACTIVE"))){
	       		/**
	       		* Create a SUPSLogEvent here indicating user is not authorised to execute the method
	       		*/
	       		SUPSLogEvent event = new SUPSLogEvent((String)context.getSystemItem(IComponentContext.SERVICE_NAME_KEY), "Method Execution Authorisation", "AUTHORISATION", (String)context.getSystemItem(IComponentContext.USER_ID_KEY), "Failure", "User is not authorised to execute method: " + (String)context.getSystemItem(IComponentContext.METHOD_NAME_KEY));
                auditLog.info(event);	       		
	       		throw new AuthorizationException("The user does not have the required roles for this operation");
			}
    }
	
    protected void rollback() {
        try
        {
            ctx.setRollbackOnly();
        }
        catch (IllegalStateException e)
        {
            log.warn("Failed to rollback transaction, probably a non-transactional method");
        }
    }
    
    protected transient XMLService service = null;
    protected static final Log baseLog = LogFactory.getLog(EchoBean.class);
    private final Log auditLog = SUPSLogFactory.getAuditLogger(EchoBean.class.getName());
    private SessionContext ctx = null;
    protected ExceptionRewriter m_exceptionRewriter = new ExceptionRewriter();
    
    public void initialise() throws SystemException
    {
        if (service == null)
        {
            service = XMLServiceFactory.getInstance(getServiceName(), getMethods(), getFrameworkConfigFile(), getProjectConfigFile());
            service.initialise();  
        }
    }
    
    /**
     * 
     * @ejb.interface-method view-type="${ejb.interfaces}"
     * @ejb.permission role-name="user"
     * @ejb.transaction type="NotSupported"
     * 
     * @param password
     *      
     */
    public String ping() throws SystemException,
            BusinessException { 		
 		return "Ping: EchoService is uk.gov.dca.test_project.EchoBean";
 	}    /**
     * @ejb.interface-method 
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 * @jboss-net.web-method
	 * @jboss-net.wsdd-operation returnQName="supsDOM"
	 * @soap.method
	 *
	 * @wlws:part user name="arg0"
	 * @wlws:part mac name="arg1"
	 * @wlws:part params name="arg2"
     * 
     * @param user
     * @param mac
     * @param params
     * @return
     * @throws Exception
     */
    public String httpCacheEndOfDay(String user, String mac, String params) throws Exception
    {
        final String methodName = "httpCacheEndOfDay";
        final String securityInfo = "<Security roles=\"user\" />";

        String output = "";
		uk.gov.dca.db.pipeline.CallStack cs = null;

        try {
            cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, params);
         	
         	// add the user id to the context
    	    ComponentContext context = cs.peek();
    	    context.putSystemItem(IComponentContext.USER_ID_KEY, user);
         	        	
         	authenticate(user, mac, params); 
         	
         	Document paramsDoc = service.applyFilter(user, params);
         	    	
         	authorize(securityInfo, context);
                	
            ComponentInput inputHolder = new ComponentInput( context.getInputConverterFactory() );
            ComponentInput outputHolder = new ComponentInput( context.getInputConverterFactory() );
            inputHolder.setData(paramsDoc, Document.class); 
            
            service.executeTemplate(methodName, inputHolder, outputHolder);
            
            Object outputObj = outputHolder.getData(String.class);
            
            if (outputObj!=null)
            {
            	output = (String)outputObj;
            }
        }
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw m_exceptionRewriter.rewrite(e);
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// rollback is automatic because SystemException extends RuntimeException
        	rollback();
        	throw m_exceptionRewriter.rewrite(e);
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// rollback is automatic
        	rollback();
        	throw m_exceptionRewriter.rewrite( new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage()) );
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw m_exceptionRewriter.rewrite( new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage()) );
        }
		finally {
			cs.pop();
		}

		 return output;   
    }    /**
     * @ejb.interface-method view-type="local"
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 *
	 * @wlws:exclude
     * 
     * @param params
     * @param w
     * @throws BusinessException
     * @throws SystemException
     */
    public void httpCacheEndOfDayLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "httpCacheEndOfDay";
        try {
        	uk.gov.dca.db.pipeline.CallStack cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, params);
        	IComponentContext context = cs.peek();
    	    
         	uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder = new uk.gov.dca.db.pipeline.component_input.ComponentInput( context.getInputConverterFactory() );
            uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder = new uk.gov.dca.db.pipeline.component_input.ComponentInput( context.getInputConverterFactory() );
            inputHolder.setData(params, String.class); 
            
            service.executeTemplate(methodName, inputHolder, outputHolder);

            cs.pop();
            
            // get output
            Object outputObj = outputHolder.getData(String.class);
            if (outputObj!=null)
            {
            	try {
        			stream.write((String)outputObj);
        		}
        		catch(IOException e) {
        			throw new SystemException("Failed to write output: "+e.getMessage(),e);
        		}
            }
        } 
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw e;
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw e;
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
    }

	/**
     * @ejb.interface-method view-type="local"
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 *
	 * @wlws:exclude
     * 
     * @param inputHolder
     * @param outputHolder
     * @throws BusinessException
     * @throws SystemException
     */
    public void httpCacheEndOfDayLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "httpCacheEndOfDay";
        try {
        	uk.gov.dca.db.pipeline.CallStack cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, inputHolder);
        	
            service.executeTemplate(methodName, inputHolder, outputHolder);

            cs.pop();
        } 
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw e;
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw e;
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
    }    /**
     * @ejb.interface-method 
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 * @jboss-net.web-method
	 * @jboss-net.wsdd-operation returnQName="supsDOM"
	 * @soap.method
	 *
	 * @wlws:part user name="arg0"
	 * @wlws:part mac name="arg1"
	 * @wlws:part params name="arg2"
     * 
     * @param user
     * @param mac
     * @param params
     * @return
     * @throws Exception
     */
    public String httpCacheTenDays(String user, String mac, String params) throws Exception
    {
        final String methodName = "httpCacheTenDays";
        final String securityInfo = "<Security roles=\"user\" />";

        String output = "";
		uk.gov.dca.db.pipeline.CallStack cs = null;

        try {
            cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, params);
         	
         	// add the user id to the context
    	    ComponentContext context = cs.peek();
    	    context.putSystemItem(IComponentContext.USER_ID_KEY, user);
         	        	
         	authenticate(user, mac, params); 
         	
         	Document paramsDoc = service.applyFilter(user, params);
         	    	
         	authorize(securityInfo, context);
                	
            ComponentInput inputHolder = new ComponentInput( context.getInputConverterFactory() );
            ComponentInput outputHolder = new ComponentInput( context.getInputConverterFactory() );
            inputHolder.setData(paramsDoc, Document.class); 
            
            service.executeTemplate(methodName, inputHolder, outputHolder);
            
            Object outputObj = outputHolder.getData(String.class);
            
            if (outputObj!=null)
            {
            	output = (String)outputObj;
            }
        }
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw m_exceptionRewriter.rewrite(e);
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// rollback is automatic because SystemException extends RuntimeException
        	rollback();
        	throw m_exceptionRewriter.rewrite(e);
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// rollback is automatic
        	rollback();
        	throw m_exceptionRewriter.rewrite( new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage()) );
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw m_exceptionRewriter.rewrite( new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage()) );
        }
		finally {
			cs.pop();
		}

		 return output;   
    }    /**
     * @ejb.interface-method view-type="local"
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 *
	 * @wlws:exclude
     * 
     * @param params
     * @param w
     * @throws BusinessException
     * @throws SystemException
     */
    public void httpCacheTenDaysLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "httpCacheTenDays";
        try {
        	uk.gov.dca.db.pipeline.CallStack cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, params);
        	IComponentContext context = cs.peek();
    	    
         	uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder = new uk.gov.dca.db.pipeline.component_input.ComponentInput( context.getInputConverterFactory() );
            uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder = new uk.gov.dca.db.pipeline.component_input.ComponentInput( context.getInputConverterFactory() );
            inputHolder.setData(params, String.class); 
            
            service.executeTemplate(methodName, inputHolder, outputHolder);

            cs.pop();
            
            // get output
            Object outputObj = outputHolder.getData(String.class);
            if (outputObj!=null)
            {
            	try {
        			stream.write((String)outputObj);
        		}
        		catch(IOException e) {
        			throw new SystemException("Failed to write output: "+e.getMessage(),e);
        		}
            }
        } 
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw e;
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw e;
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
    }

	/**
     * @ejb.interface-method view-type="local"
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 *
	 * @wlws:exclude
     * 
     * @param inputHolder
     * @param outputHolder
     * @throws BusinessException
     * @throws SystemException
     */
    public void httpCacheTenDaysLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "httpCacheTenDays";
        try {
        	uk.gov.dca.db.pipeline.CallStack cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, inputHolder);
        	
            service.executeTemplate(methodName, inputHolder, outputHolder);

            cs.pop();
        } 
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw e;
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw e;
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
    }    /**
     * @ejb.interface-method 
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 * @jboss-net.web-method
	 * @jboss-net.wsdd-operation returnQName="supsDOM"
	 * @soap.method
	 *
	 * @wlws:part user name="arg0"
	 * @wlws:part mac name="arg1"
	 * @wlws:part params name="arg2"
     * 
     * @param user
     * @param mac
     * @param params
     * @return
     * @throws Exception
     */
    public String httpCacheTenMins(String user, String mac, String params) throws Exception
    {
        final String methodName = "httpCacheTenMins";
        final String securityInfo = "<Security roles=\"user\" />";

        String output = "";
		uk.gov.dca.db.pipeline.CallStack cs = null;

        try {
            cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, params);
         	
         	// add the user id to the context
    	    ComponentContext context = cs.peek();
    	    context.putSystemItem(IComponentContext.USER_ID_KEY, user);
         	        	
         	authenticate(user, mac, params); 
         	
         	Document paramsDoc = service.applyFilter(user, params);
         	    	
         	authorize(securityInfo, context);
                	
            ComponentInput inputHolder = new ComponentInput( context.getInputConverterFactory() );
            ComponentInput outputHolder = new ComponentInput( context.getInputConverterFactory() );
            inputHolder.setData(paramsDoc, Document.class); 
            
            service.executeTemplate(methodName, inputHolder, outputHolder);
            
            Object outputObj = outputHolder.getData(String.class);
            
            if (outputObj!=null)
            {
            	output = (String)outputObj;
            }
        }
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw m_exceptionRewriter.rewrite(e);
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// rollback is automatic because SystemException extends RuntimeException
        	rollback();
        	throw m_exceptionRewriter.rewrite(e);
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// rollback is automatic
        	rollback();
        	throw m_exceptionRewriter.rewrite( new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage()) );
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw m_exceptionRewriter.rewrite( new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage()) );
        }
		finally {
			cs.pop();
		}

		 return output;   
    }    /**
     * @ejb.interface-method view-type="local"
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 *
	 * @wlws:exclude
     * 
     * @param params
     * @param w
     * @throws BusinessException
     * @throws SystemException
     */
    public void httpCacheTenMinsLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "httpCacheTenMins";
        try {
        	uk.gov.dca.db.pipeline.CallStack cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, params);
        	IComponentContext context = cs.peek();
    	    
         	uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder = new uk.gov.dca.db.pipeline.component_input.ComponentInput( context.getInputConverterFactory() );
            uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder = new uk.gov.dca.db.pipeline.component_input.ComponentInput( context.getInputConverterFactory() );
            inputHolder.setData(params, String.class); 
            
            service.executeTemplate(methodName, inputHolder, outputHolder);

            cs.pop();
            
            // get output
            Object outputObj = outputHolder.getData(String.class);
            if (outputObj!=null)
            {
            	try {
        			stream.write((String)outputObj);
        		}
        		catch(IOException e) {
        			throw new SystemException("Failed to write output: "+e.getMessage(),e);
        		}
            }
        } 
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw e;
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw e;
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
    }

	/**
     * @ejb.interface-method view-type="local"
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 *
	 * @wlws:exclude
     * 
     * @param inputHolder
     * @param outputHolder
     * @throws BusinessException
     * @throws SystemException
     */
    public void httpCacheTenMinsLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "httpCacheTenMins";
        try {
        	uk.gov.dca.db.pipeline.CallStack cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, inputHolder);
        	
            service.executeTemplate(methodName, inputHolder, outputHolder);

            cs.pop();
        } 
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw e;
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw e;
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
    }    /**
     * @ejb.interface-method 
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 * @jboss-net.web-method
	 * @jboss-net.wsdd-operation returnQName="supsDOM"
	 * @soap.method
	 *
	 * @wlws:part user name="arg0"
	 * @wlws:part mac name="arg1"
	 * @wlws:part params name="arg2"
     * 
     * @param user
     * @param mac
     * @param params
     * @return
     * @throws Exception
     */
    public String httpCacheTenHours(String user, String mac, String params) throws Exception
    {
        final String methodName = "httpCacheTenHours";
        final String securityInfo = "<Security roles=\"user\" />";

        String output = "";
		uk.gov.dca.db.pipeline.CallStack cs = null;

        try {
            cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, params);
         	
         	// add the user id to the context
    	    ComponentContext context = cs.peek();
    	    context.putSystemItem(IComponentContext.USER_ID_KEY, user);
         	        	
         	authenticate(user, mac, params); 
         	
         	Document paramsDoc = service.applyFilter(user, params);
         	    	
         	authorize(securityInfo, context);
                	
            ComponentInput inputHolder = new ComponentInput( context.getInputConverterFactory() );
            ComponentInput outputHolder = new ComponentInput( context.getInputConverterFactory() );
            inputHolder.setData(paramsDoc, Document.class); 
            
            service.executeTemplate(methodName, inputHolder, outputHolder);
            
            Object outputObj = outputHolder.getData(String.class);
            
            if (outputObj!=null)
            {
            	output = (String)outputObj;
            }
        }
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw m_exceptionRewriter.rewrite(e);
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// rollback is automatic because SystemException extends RuntimeException
        	rollback();
        	throw m_exceptionRewriter.rewrite(e);
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// rollback is automatic
        	rollback();
        	throw m_exceptionRewriter.rewrite( new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage()) );
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw m_exceptionRewriter.rewrite( new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage()) );
        }
		finally {
			cs.pop();
		}

		 return output;   
    }    /**
     * @ejb.interface-method view-type="local"
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 *
	 * @wlws:exclude
     * 
     * @param params
     * @param w
     * @throws BusinessException
     * @throws SystemException
     */
    public void httpCacheTenHoursLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "httpCacheTenHours";
        try {
        	uk.gov.dca.db.pipeline.CallStack cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, params);
        	IComponentContext context = cs.peek();
    	    
         	uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder = new uk.gov.dca.db.pipeline.component_input.ComponentInput( context.getInputConverterFactory() );
            uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder = new uk.gov.dca.db.pipeline.component_input.ComponentInput( context.getInputConverterFactory() );
            inputHolder.setData(params, String.class); 
            
            service.executeTemplate(methodName, inputHolder, outputHolder);

            cs.pop();
            
            // get output
            Object outputObj = outputHolder.getData(String.class);
            if (outputObj!=null)
            {
            	try {
        			stream.write((String)outputObj);
        		}
        		catch(IOException e) {
        			throw new SystemException("Failed to write output: "+e.getMessage(),e);
        		}
            }
        } 
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw e;
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw e;
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
    }

	/**
     * @ejb.interface-method view-type="local"
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 *
	 * @wlws:exclude
     * 
     * @param inputHolder
     * @param outputHolder
     * @throws BusinessException
     * @throws SystemException
     */
    public void httpCacheTenHoursLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "httpCacheTenHours";
        try {
        	uk.gov.dca.db.pipeline.CallStack cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, inputHolder);
        	
            service.executeTemplate(methodName, inputHolder, outputHolder);

            cs.pop();
        } 
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw e;
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw e;
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
    }    /**
     * @ejb.interface-method 
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 * @jboss-net.web-method
	 * @jboss-net.wsdd-operation returnQName="supsDOM"
	 * @soap.method
	 *
	 * @wlws:part user name="arg0"
	 * @wlws:part mac name="arg1"
	 * @wlws:part params name="arg2"
     * 
     * @param user
     * @param mac
     * @param params
     * @return
     * @throws Exception
     */
    public String httpPost(String user, String mac, String params) throws Exception
    {
        final String methodName = "httpPost";
        final String securityInfo = "<Security roles=\"user\" />";

        String output = "";
		uk.gov.dca.db.pipeline.CallStack cs = null;

        try {
            cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, params);
         	
         	// add the user id to the context
    	    ComponentContext context = cs.peek();
    	    context.putSystemItem(IComponentContext.USER_ID_KEY, user);
         	        	
         	authenticate(user, mac, params); 
         	
         	Document paramsDoc = service.applyFilter(user, params);
         	    	
         	authorize(securityInfo, context);
                	
            ComponentInput inputHolder = new ComponentInput( context.getInputConverterFactory() );
            ComponentInput outputHolder = new ComponentInput( context.getInputConverterFactory() );
            inputHolder.setData(paramsDoc, Document.class); 
            
            service.executeTemplate(methodName, inputHolder, outputHolder);
            
            Object outputObj = outputHolder.getData(String.class);
            
            if (outputObj!=null)
            {
            	output = (String)outputObj;
            }
        }
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw m_exceptionRewriter.rewrite(e);
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// rollback is automatic because SystemException extends RuntimeException
        	rollback();
        	throw m_exceptionRewriter.rewrite(e);
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// rollback is automatic
        	rollback();
        	throw m_exceptionRewriter.rewrite( new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage()) );
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw m_exceptionRewriter.rewrite( new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage()) );
        }
		finally {
			cs.pop();
		}

		 return output;   
    }    /**
     * @ejb.interface-method view-type="local"
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 *
	 * @wlws:exclude
     * 
     * @param params
     * @param w
     * @throws BusinessException
     * @throws SystemException
     */
    public void httpPostLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "httpPost";
        try {
        	uk.gov.dca.db.pipeline.CallStack cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, params);
        	IComponentContext context = cs.peek();
    	    
         	uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder = new uk.gov.dca.db.pipeline.component_input.ComponentInput( context.getInputConverterFactory() );
            uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder = new uk.gov.dca.db.pipeline.component_input.ComponentInput( context.getInputConverterFactory() );
            inputHolder.setData(params, String.class); 
            
            service.executeTemplate(methodName, inputHolder, outputHolder);

            cs.pop();
            
            // get output
            Object outputObj = outputHolder.getData(String.class);
            if (outputObj!=null)
            {
            	try {
        			stream.write((String)outputObj);
        		}
        		catch(IOException e) {
        			throw new SystemException("Failed to write output: "+e.getMessage(),e);
        		}
            }
        } 
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw e;
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw e;
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
    }

	/**
     * @ejb.interface-method view-type="local"
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 *
	 * @wlws:exclude
     * 
     * @param inputHolder
     * @param outputHolder
     * @throws BusinessException
     * @throws SystemException
     */
    public void httpPostLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "httpPost";
        try {
        	uk.gov.dca.db.pipeline.CallStack cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, inputHolder);
        	
            service.executeTemplate(methodName, inputHolder, outputHolder);

            cs.pop();
        } 
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw e;
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw e;
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
    }    /**
     * @ejb.interface-method 
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 * @jboss-net.web-method
	 * @jboss-net.wsdd-operation returnQName="supsDOM"
	 * @soap.method
	 *
	 * @wlws:part user name="arg0"
	 * @wlws:part mac name="arg1"
	 * @wlws:part params name="arg2"
     * 
     * @param user
     * @param mac
     * @param params
     * @return
     * @throws Exception
     */
    public String httpCacheTenSecs(String user, String mac, String params) throws Exception
    {
        final String methodName = "httpCacheTenSecs";
        final String securityInfo = "<Security roles=\"user\" />";

        String output = "";
		uk.gov.dca.db.pipeline.CallStack cs = null;

        try {
            cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, params);
         	
         	// add the user id to the context
    	    ComponentContext context = cs.peek();
    	    context.putSystemItem(IComponentContext.USER_ID_KEY, user);
         	        	
         	authenticate(user, mac, params); 
         	
         	Document paramsDoc = service.applyFilter(user, params);
         	    	
         	authorize(securityInfo, context);
                	
            ComponentInput inputHolder = new ComponentInput( context.getInputConverterFactory() );
            ComponentInput outputHolder = new ComponentInput( context.getInputConverterFactory() );
            inputHolder.setData(paramsDoc, Document.class); 
            
            service.executeTemplate(methodName, inputHolder, outputHolder);
            
            Object outputObj = outputHolder.getData(String.class);
            
            if (outputObj!=null)
            {
            	output = (String)outputObj;
            }
        }
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw m_exceptionRewriter.rewrite(e);
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// rollback is automatic because SystemException extends RuntimeException
        	rollback();
        	throw m_exceptionRewriter.rewrite(e);
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// rollback is automatic
        	rollback();
        	throw m_exceptionRewriter.rewrite( new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage()) );
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw m_exceptionRewriter.rewrite( new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage()) );
        }
		finally {
			cs.pop();
		}

		 return output;   
    }    /**
     * @ejb.interface-method view-type="local"
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 *
	 * @wlws:exclude
     * 
     * @param params
     * @param w
     * @throws BusinessException
     * @throws SystemException
     */
    public void httpCacheTenSecsLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "httpCacheTenSecs";
        try {
        	uk.gov.dca.db.pipeline.CallStack cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, params);
        	IComponentContext context = cs.peek();
    	    
         	uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder = new uk.gov.dca.db.pipeline.component_input.ComponentInput( context.getInputConverterFactory() );
            uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder = new uk.gov.dca.db.pipeline.component_input.ComponentInput( context.getInputConverterFactory() );
            inputHolder.setData(params, String.class); 
            
            service.executeTemplate(methodName, inputHolder, outputHolder);

            cs.pop();
            
            // get output
            Object outputObj = outputHolder.getData(String.class);
            if (outputObj!=null)
            {
            	try {
        			stream.write((String)outputObj);
        		}
        		catch(IOException e) {
        			throw new SystemException("Failed to write output: "+e.getMessage(),e);
        		}
            }
        } 
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw e;
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw e;
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
    }

	/**
     * @ejb.interface-method view-type="local"
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 *
	 * @wlws:exclude
     * 
     * @param inputHolder
     * @param outputHolder
     * @throws BusinessException
     * @throws SystemException
     */
    public void httpCacheTenSecsLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "httpCacheTenSecs";
        try {
        	uk.gov.dca.db.pipeline.CallStack cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, inputHolder);
        	
            service.executeTemplate(methodName, inputHolder, outputHolder);

            cs.pop();
        } 
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw e;
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw e;
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
    }    /**
     * @ejb.interface-method 
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 * @jboss-net.web-method
	 * @jboss-net.wsdd-operation returnQName="supsDOM"
	 * @soap.method
	 *
	 * @wlws:part user name="arg0"
	 * @wlws:part mac name="arg1"
	 * @wlws:part params name="arg2"
     * 
     * @param user
     * @param mac
     * @param params
     * @return
     * @throws Exception
     */
    public String httpGet(String user, String mac, String params) throws Exception
    {
        final String methodName = "httpGet";
        final String securityInfo = "<Security roles=\"user\" />";

        String output = "";
		uk.gov.dca.db.pipeline.CallStack cs = null;

        try {
            cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, params);
         	
         	// add the user id to the context
    	    ComponentContext context = cs.peek();
    	    context.putSystemItem(IComponentContext.USER_ID_KEY, user);
         	        	
         	authenticate(user, mac, params); 
         	
         	Document paramsDoc = service.applyFilter(user, params);
         	    	
         	authorize(securityInfo, context);
                	
            ComponentInput inputHolder = new ComponentInput( context.getInputConverterFactory() );
            ComponentInput outputHolder = new ComponentInput( context.getInputConverterFactory() );
            inputHolder.setData(paramsDoc, Document.class); 
            
            service.executeTemplate(methodName, inputHolder, outputHolder);
            
            Object outputObj = outputHolder.getData(String.class);
            
            if (outputObj!=null)
            {
            	output = (String)outputObj;
            }
        }
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw m_exceptionRewriter.rewrite(e);
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// rollback is automatic because SystemException extends RuntimeException
        	rollback();
        	throw m_exceptionRewriter.rewrite(e);
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// rollback is automatic
        	rollback();
        	throw m_exceptionRewriter.rewrite( new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage()) );
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw m_exceptionRewriter.rewrite( new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage()) );
        }
		finally {
			cs.pop();
		}

		 return output;   
    }    /**
     * @ejb.interface-method view-type="local"
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 *
	 * @wlws:exclude
     * 
     * @param params
     * @param w
     * @throws BusinessException
     * @throws SystemException
     */
    public void httpGetLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "httpGet";
        try {
        	uk.gov.dca.db.pipeline.CallStack cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, params);
        	IComponentContext context = cs.peek();
    	    
         	uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder = new uk.gov.dca.db.pipeline.component_input.ComponentInput( context.getInputConverterFactory() );
            uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder = new uk.gov.dca.db.pipeline.component_input.ComponentInput( context.getInputConverterFactory() );
            inputHolder.setData(params, String.class); 
            
            service.executeTemplate(methodName, inputHolder, outputHolder);

            cs.pop();
            
            // get output
            Object outputObj = outputHolder.getData(String.class);
            if (outputObj!=null)
            {
            	try {
        			stream.write((String)outputObj);
        		}
        		catch(IOException e) {
        			throw new SystemException("Failed to write output: "+e.getMessage(),e);
        		}
            }
        } 
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw e;
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw e;
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
    }

	/**
     * @ejb.interface-method view-type="local"
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 *
	 * @wlws:exclude
     * 
     * @param inputHolder
     * @param outputHolder
     * @throws BusinessException
     * @throws SystemException
     */
    public void httpGetLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "httpGet";
        try {
        	uk.gov.dca.db.pipeline.CallStack cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        	cs.push(getServiceName(), methodName, inputHolder);
        	
            service.executeTemplate(methodName, inputHolder, outputHolder);

            cs.pop();
        } 
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
        	throw e;
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw e;
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	rollback();
        	throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	rollback();
            throw new SystemException("Service call '" + SERVICE_NAME + "." + methodName + "' failed : " + e.getMessage());
        }
    }}