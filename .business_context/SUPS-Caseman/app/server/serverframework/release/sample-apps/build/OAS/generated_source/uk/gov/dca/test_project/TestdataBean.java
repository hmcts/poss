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
 * 			 name="TestdataService"
 *           jndi-name="TestdataService"
 *			 local-jndi-name="ejb/TestdataServiceLocal"
 *           view-type="${ejb.interfaces}"
 *
 * @ejb.interface service-endpoint-class="uk.gov.dca.test_project.TestdataServiceService"
 *
 * @ejb.ejb-ref ejb-name="TestdataService"
 *				view-type="local"
 *				ref-name="ejb/TestdataServiceLocal"
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
 * @oc4j.bean jndi-name="TestdataService" pool-cache-timeout="0"
 *
 * @wsee.port-component name="TestdataServiceServicePort"
 * @jboss-net.web-service urn = "Testdata"
 * @jboss-net.authentication domain="other" validate-unauthenticated-calls="true"
 * jboss-net.authorization domain="other" roles-allowed="user"
 *
 * @soap.service urn="Testdata"
 *
 * @author Michael Barker
 *
 */
public class TestdataBean implements javax.ejb.SessionBean
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
    
    private final static String SERVICE_NAME = "Testdata";
    private final static String PROJECT_FILE = "uk/gov/dca/test_project/project_config.xml";
    private final static String FRAMEWORK_CONFIG_FILE = "uk/gov/dca/test_project/sups_config.xml";
    private final static String[] METHODS = {
        "uk/gov/dca/test_project/testdata_service/methods/add_test_data_sequence.xml","uk/gov/dca/test_project/testdata_service/methods/add_person.xml","uk/gov/dca/test_project/testdata_service/methods/add_person_linked.xml","uk/gov/dca/test_project/testdata_service/methods/get_person_linked.xml","uk/gov/dca/test_project/testdata_service/methods/get_person.xml","uk/gov/dca/test_project/testdata_service/methods/add_test_data_no_sequence.xml","uk/gov/dca/test_project/testdata_service/methods/get_test_data.xml"
    };
    private static final Log log = SUPSLogFactory.getLogger(TestdataBean.class);
    
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
    protected static final Log baseLog = LogFactory.getLog(TestdataBean.class);
    private final Log auditLog = SUPSLogFactory.getAuditLogger(TestdataBean.class.getName());
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
 		return "Ping: TestdataService is uk.gov.dca.test_project.TestdataBean";
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
    public String addTestDataSequence(String user, String mac, String params) throws Exception
    {
        final String methodName = "addTestDataSequence";
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
    public void addTestDataSequenceLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "addTestDataSequence";
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
    public void addTestDataSequenceLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "addTestDataSequence";
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
    public String addPerson(String user, String mac, String params) throws Exception
    {
        final String methodName = "addPerson";
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
    public void addPersonLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "addPerson";
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
    public void addPersonLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "addPerson";
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
    public String addPersonLinked(String user, String mac, String params) throws Exception
    {
        final String methodName = "addPersonLinked";
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
    public void addPersonLinkedLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "addPersonLinked";
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
    public void addPersonLinkedLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "addPersonLinked";
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
    public String getPersonLinked(String user, String mac, String params) throws Exception
    {
        final String methodName = "getPersonLinked";
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
    public void getPersonLinkedLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getPersonLinked";
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
    public void getPersonLinkedLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getPersonLinked";
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
    public String getPerson(String user, String mac, String params) throws Exception
    {
        final String methodName = "getPerson";
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
    public void getPersonLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getPerson";
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
    public void getPersonLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getPerson";
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
    public String addTestDataNoSequence(String user, String mac, String params) throws Exception
    {
        final String methodName = "addTestDataNoSequence";
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
    public void addTestDataNoSequenceLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "addTestDataNoSequence";
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
    public void addTestDataNoSequenceLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "addTestDataNoSequence";
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
    public String getTestData(String user, String mac, String params) throws Exception
    {
        final String methodName = "getTestData";
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
    public void getTestDataLocal (String params, Writer stream) throws BusinessException, SystemException
    {
        final String methodName = "getTestData";
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
    public void getTestDataLocal2 (uk.gov.dca.db.pipeline.component_input.ComponentInput inputHolder, uk.gov.dca.db.pipeline.component_input.ComponentInput outputHolder) throws BusinessException, SystemException
    {
        final String methodName = "getTestData";
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