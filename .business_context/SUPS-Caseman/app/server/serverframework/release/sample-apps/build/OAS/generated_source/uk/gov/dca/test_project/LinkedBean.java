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
 * 			 name="LinkedService"
 *           jndi-name="LinkedService"
 *			 local-jndi-name="ejb/LinkedServiceLocal"
 *           view-type="${ejb.interfaces}"
 *
 * @ejb.interface service-endpoint-class="uk.gov.dca.test_project.LinkedServiceService"
 *
 * @ejb.ejb-ref ejb-name="LinkedService"
 *				view-type="local"
 *				ref-name="ejb/LinkedServiceLocal"
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
 * @oc4j.bean jndi-name="LinkedService" pool-cache-timeout="0"
 *
 * @wsee.port-component name="LinkedServiceServicePort"
 * @jboss-net.web-service urn = "Linked"
 * @jboss-net.authentication domain="other" validate-unauthenticated-calls="true"
 * jboss-net.authorization domain="other" roles-allowed="user"
 *
 * @soap.service urn="Linked"
 *
 * @author Michael Barker
 *
 */
public class LinkedBean implements javax.ejb.SessionBean
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
    
    private final static String SERVICE_NAME = "Linked";
    private final static String PROJECT_FILE = "uk/gov/dca/test_project/project_config.xml";
    private final static String FRAMEWORK_CONFIG_FILE = "uk/gov/dca/test_project/sups_config.xml";
    private final static String[] METHODS = {
        "uk/gov/dca/test_project/linked_service/methods/get_long.xml","uk/gov/dca/test_project/linked_service/methods/get_case_dual.xml","uk/gov/dca/test_project/linked_service/methods/get_sessions_ordered.xml","uk/gov/dca/test_project/linked_service/methods/get_judge.xml","uk/gov/dca/test_project/linked_service/methods/get_all_linked.xml","uk/gov/dca/test_project/linked_service/methods/get_case_dyn.xml","uk/gov/dca/test_project/linked_service/methods/get_case.xml","uk/gov/dca/test_project/linked_service/methods/get_case_sql.xml","uk/gov/dca/test_project/linked_service/methods/add_date.xml","uk/gov/dca/test_project/linked_service/methods/get_sessions.xml","uk/gov/dca/test_project/linked_service/methods/get_date.xml","uk/gov/dca/test_project/linked_service/methods/get_court_by_user.xml","uk/gov/dca/test_project/linked_service/methods/get_case_linked_dyn.xml","uk/gov/dca/test_project/linked_service/methods/get_long_paged.xml","uk/gov/dca/test_project/linked_service/methods/get_all_paged.xml","uk/gov/dca/test_project/linked_service/methods/get_session.xml","uk/gov/dca/test_project/linked_service/methods/get_all.xml","uk/gov/dca/test_project/linked_service/methods/add_judge.xml","uk/gov/dca/test_project/linked_service/methods/get_case_sql2.xml","uk/gov/dca/test_project/linked_service/methods/get_all_linked_sql.xml","uk/gov/dca/test_project/linked_service/methods/add_case.xml","uk/gov/dca/test_project/linked_service/methods/get_case_linked.xml","uk/gov/dca/test_project/linked_service/methods/get_case_null_param.xml","uk/gov/dca/test_project/linked_service/methods/delete_session.xml"
    };
    private static final Log log = SUPSLogFactory.getLogger(LinkedBean.class);
    
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
    protected static final Log baseLog = LogFactory.getLog(LinkedBean.class);
    private final Log auditLog = SUPSLogFactory.getAuditLogger(LinkedBean.class.getName());
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
 		return "Ping: LinkedService is uk.gov.dca.test_project.LinkedBean";
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
    public String getLong(String user, String mac, String params) throws Exception
    {
        final String methodName = "getLong";
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
    public void getLongLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getLong";
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
    public void getLongLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getLong";
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
    public String getCaseDual(String user, String mac, String params) throws Exception
    {
        final String methodName = "getCaseDual";
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
    public void getCaseDualLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getCaseDual";
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
    public void getCaseDualLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getCaseDual";
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
    public String getSessionsOrdered(String user, String mac, String params) throws Exception
    {
        final String methodName = "getSessionsOrdered";
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
    public void getSessionsOrderedLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getSessionsOrdered";
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
    public void getSessionsOrderedLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getSessionsOrdered";
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
    public String getJudge(String user, String mac, String params) throws Exception
    {
        final String methodName = "getJudge";
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
    public void getJudgeLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getJudge";
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
    public void getJudgeLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getJudge";
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
    public String getAllLinked(String user, String mac, String params) throws Exception
    {
        final String methodName = "getAllLinked";
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
    public void getAllLinkedLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getAllLinked";
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
    public void getAllLinkedLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getAllLinked";
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
    public String getCaseDyn(String user, String mac, String params) throws Exception
    {
        final String methodName = "getCaseDyn";
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
    public void getCaseDynLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getCaseDyn";
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
    public void getCaseDynLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getCaseDyn";
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
    public String getCase(String user, String mac, String params) throws Exception
    {
        final String methodName = "getCase";
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
    public void getCaseLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getCase";
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
    public void getCaseLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getCase";
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
    public String getCaseSql(String user, String mac, String params) throws Exception
    {
        final String methodName = "getCaseSql";
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
    public void getCaseSqlLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getCaseSql";
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
    public void getCaseSqlLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getCaseSql";
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
    public String addDate(String user, String mac, String params) throws Exception
    {
        final String methodName = "addDate";
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
    public void addDateLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "addDate";
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
    public void addDateLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "addDate";
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
    public String getSessions(String user, String mac, String params) throws Exception
    {
        final String methodName = "getSessions";
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
    public void getSessionsLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getSessions";
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
    public void getSessionsLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getSessions";
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
    public String getDate(String user, String mac, String params) throws Exception
    {
        final String methodName = "getDate";
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
    public void getDateLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getDate";
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
    public void getDateLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getDate";
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
    public String getCourtByUser(String user, String mac, String params) throws Exception
    {
        final String methodName = "getCourtByUser";
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
    public void getCourtByUserLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getCourtByUser";
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
    public void getCourtByUserLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getCourtByUser";
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
    public String getCaseLinkedDyn(String user, String mac, String params) throws Exception
    {
        final String methodName = "getCaseLinkedDyn";
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
    public void getCaseLinkedDynLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getCaseLinkedDyn";
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
    public void getCaseLinkedDynLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getCaseLinkedDyn";
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
    public String getLongPaged(String user, String mac, String params) throws Exception
    {
        final String methodName = "getLongPaged";
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
    public void getLongPagedLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getLongPaged";
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
    public void getLongPagedLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getLongPaged";
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
    public String getAllPaged(String user, String mac, String params) throws Exception
    {
        final String methodName = "getAllPaged";
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
    public void getAllPagedLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getAllPaged";
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
    public void getAllPagedLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getAllPaged";
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
    public String getSession(String user, String mac, String params) throws Exception
    {
        final String methodName = "getSession";
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
    public void getSessionLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getSession";
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
    public void getSessionLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getSession";
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
    public String getAll(String user, String mac, String params) throws Exception
    {
        final String methodName = "getAll";
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
    public void getAllLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getAll";
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
    public void getAllLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getAll";
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
    public String addJudge(String user, String mac, String params) throws Exception
    {
        final String methodName = "addJudge";
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
    public void addJudgeLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "addJudge";
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
    public void addJudgeLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "addJudge";
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
    public String getCaseSql2(String user, String mac, String params) throws Exception
    {
        final String methodName = "getCaseSql2";
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
    public void getCaseSql2Local (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getCaseSql2";
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
    public void getCaseSql2Local2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getCaseSql2";
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
    public String getAllLinkedSql(String user, String mac, String params) throws Exception
    {
        final String methodName = "getAllLinkedSql";
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
    public void getAllLinkedSqlLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getAllLinkedSql";
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
    public void getAllLinkedSqlLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getAllLinkedSql";
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
    public String addCase(String user, String mac, String params) throws Exception
    {
        final String methodName = "addCase";
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
    public void addCaseLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "addCase";
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
    public void addCaseLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "addCase";
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
    public String getCaseLinked(String user, String mac, String params) throws Exception
    {
        final String methodName = "getCaseLinked";
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
    public void getCaseLinkedLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getCaseLinked";
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
    public void getCaseLinkedLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getCaseLinked";
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
    public String getCaseNullParam(String user, String mac, String params) throws Exception
    {
        final String methodName = "getCaseNullParam";
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
    public void getCaseNullParamLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getCaseNullParam";
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
    public void getCaseNullParamLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getCaseNullParam";
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
    public String deleteSession(String user, String mac, String params) throws Exception
    {
        final String methodName = "deleteSession";
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
    public void deleteSessionLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "deleteSession";
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
    public void deleteSessionLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "deleteSession";
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