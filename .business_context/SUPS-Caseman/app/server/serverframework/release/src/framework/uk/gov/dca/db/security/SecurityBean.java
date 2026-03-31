package uk.gov.dca.db.security;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.Writer;
import java.rmi.RemoteException;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.ejb.CreateException;
import javax.ejb.EJBException;
import javax.ejb.SessionBean;
import javax.ejb.SessionContext;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;
import org.xml.sax.InputSource;

import uk.gov.dca.db.ejb.ExceptionRewriter;
import uk.gov.dca.db.ejb.filter.Filter;
import uk.gov.dca.db.exception.AuthorisationException;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;
import uk.gov.dca.db.pipeline.CallStack;
import uk.gov.dca.db.pipeline.ComponentContext;
import uk.gov.dca.db.pipeline.ComponentFactory;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.security.authorization.IAuthorizationPlugin;
import uk.gov.dca.db.security.authorization.RolesOutputRenderer;
import uk.gov.dca.db.security.authorization.UserProfile;
import uk.gov.dca.db.security.printers.PrinterDetails;
import uk.gov.dca.db.security.printers.PrinterDetailsDAO;
import uk.gov.dca.db.security.printers.PrinterDetailsSerializer;
import uk.gov.dca.db.security.user.ADUserPersonalDetails;
import uk.gov.dca.db.security.user.UpdateUserCourtDetails;
import uk.gov.dca.db.security.user.UpdateUserDetails;
import uk.gov.dca.db.security.user.UserCourtDetails;
import uk.gov.dca.db.security.user.UserPersonalDetails;
import uk.gov.dca.db.util.FrameworkConfigParam;
import uk.gov.dca.db.util.SUPSLogEvent;
import uk.gov.dca.db.util.SUPSLogFactory;
import uk.gov.dca.db.util.XMLUtil;

/**
 *
 * @ejb.bean type="Stateless"
 *           name="SecurityService"
 *           jndi-name="SecurityService"
 *           local-jndi-name="ejb/SecurityServiceLocal"
 *           view-type="${ejb.interfaces}"
 * 
 * @ejb.interface service-endpoint-class="uk.gov.dca.db.security.SecurityServiceService"
 *
 * @oc4j.bean jndi-name="SecurityService"
 *
 * @ejb.ejb-external-ref view-type="local"
 *                       type="Session"
 *                       ref-name="ejb/CommandProcessorLocal"
 *                       home="uk.gov.dca.db.impl.command.CommandProcessorLocalHome"
 *                       business="uk.gov.dca.db.impl.command.CommandProcessor"
 *                       link="CommandProcessor"
 *
 * @wsee.port-component name="SecurityServiceServicePort"
 * @jboss-net.web-service urn = "Security"
 * @jboss-net.authentication domain="other" validate-unauthenticated-calls="true"
 * @jboss-net.authorization domain="other" roles-allowed="user"
 *
 * @soap.service urn="Security"
 * 
 * @author JamesB
 */
public class SecurityBean implements SessionBean {
    
    private static final long serialVersionUID = 3875009006019718134L;
    
    /**
     * 
     * @ejb.create-method
     * @ejb.permission role-name="user,checker"
     * 
     * @throws CreateException
     */
    public void ejbCreate() throws CreateException {
        try {
            SecurityFactory factory = new SecurityFactory(); 
            securityActive = factory.getSecurityActiveFlag();
            context = factory.createSecurityContext();
            m_authenticator = factory.createAuthenticator();
            userProfile = factory.createUserProfile();
            m_printerDetailsDAO = factory.createPrinterDetailsDAO();
            InputSource is = Util.getInputSource(FrameworkConfigParam.FRAMEWORK_CONFIG.getValue(), this);
            compFact = new ComponentFactory(is);
            
            log.debug("SecurityBean authenticator created: "+m_authenticator.getClass().getName());
        }
        catch( SecurityFactoryException e ) {
            log.error("SecurityBean creation exception: "+e.getMessage(), e);
            throw new CreateException(e.getMessage());
        }
        catch( SystemException e ) {
            log.error("SecurityBean creation exception: "+e.getMessage(), e);
            throw new CreateException(e.getMessage());
        }
        catch( BusinessException e ) {
            log.error("SecurityBean creation exception: "+e.getMessage(), e);
            throw new CreateException(e.getMessage());
        }
    }

    /* (non-Javadoc)
     * @see javax.ejb.SessionBean#setSessionContext(javax.ejb.SessionContext)
     */
    public void setSessionContext(SessionContext arg0) throws EJBException,
            RemoteException {
        m_sessionContext = arg0;
    }

    /* (non-Javadoc)
     * @see javax.ejb.SessionBean#ejbRemove()
     */
    public void ejbRemove() throws EJBException, RemoteException {

    }

    /* (non-Javadoc)
     * @see javax.ejb.SessionBean#ejbActivate()
     */
    public void ejbActivate() throws EJBException, RemoteException {

    }

    /* (non-Javadoc)
     * @see javax.ejb.SessionBean#ejbPassivate()
     */
    public void ejbPassivate() throws EJBException, RemoteException {

    }
    
    /**
     * @ejb.interface-method view-type="local"
     * @ejb.permission role-name="user,checker"
     * 
     * @ejb.transaction type="Required"
     *
     * @wlws:exclude
     * 
     * @param user
     * @param password
     * @return
     */
    public String login(String user, String password) throws SystemException, BusinessException 
    {
        String sSessionKey = null;      
        boolean bValid = authenticate(user,password);
        
        if(bValid){
            
            log.debug("Checking if user '"+user+"' is active.");            
            if(!userProfile.isUserActive(user)){
                SUPSLogEvent event = new SUPSLogEvent("Security Service", "User Authentication", "LOGIN", user, "Failure", "Login has been unsuccessful, user is inactive");
                auditLog.info(event);
                throw new AuthenticationException(MessageFormat.format(IAuthenticator.AUTH_FAILURE_MSG, new Object[] { user }));
            }        
            
            userProfile.updatePersonalDetails(user);
            
            // generate the session key
            sSessionKey = context.getSessionKey(user);
            
            if(log.isDebugEnabled()) {
                log.debug("login(): " + user + " successfully authenticated");
                log.debug("login(): " + user + " allocated session key: " + sSessionKey);
            }
            
            if(auditLog.isInfoEnabled()){
                SUPSLogEvent event = new SUPSLogEvent("Security Service", "User Authentication", "LOGIN", user, "Success", "Login has been successful");
                auditLog.info(event);
            }
        }
        else {
            SUPSLogEvent event = new SUPSLogEvent("Security Service", "User Authentication", "LOGIN", user, "Failure", "Login has been unsuccessful, invalid username or password");
            auditLog.info(event);
        }   
        
        return sSessionKey;
    }

    /**
     * @ejb.interface-method
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     * @jboss-net.web-method
     * @jboss-net.wsdd-operation returnQName="supsDOM"
     * @soap.method
     *
     * @param userId
     * @param mac
     * @param params
     * @return
     * @throws SystemException
     * @throws BusinessException
     */
    public String createUser(String userId, String mac, String params) throws Exception
    {   
        MethodCommand cmd = new AbstractMethodCommand("Security", "createUser")
        {
            public String invoke(String userId, String mac, Document parameters) throws SystemException, BusinessException
            {
                StringBuffer response = null;

                Element courtIdEl = XMLUtil.selectElement(parameters, COURT_XPATH);
                
                if ( courtIdEl == null ) {
                    throw new BusinessException("No court selected for update. \"/params/param[@name='courtId']\" required");
                }
                String courtCode = courtIdEl.getValue();

                if ( !authorizeSecurityMethod(userId, courtCode, userId, true, false)) {
                    throw new AuthorisationException("Failed validation of message authentication code");
                }
                
                // get any optional/app specific user details to be included 
                UpdateUserDetails updateDetails = extractSUPSUserDetailsParameters(parameters);
                if (updateDetails.getSetActiveUser() == false) {
                    throw new BusinessException("Active user flag is a required parameter when creating a user");
                }
                
                // get any optional/app specific user court details to be included 
                UpdateUserCourtDetails updateCourtDetails = extractSUPSUserCourtParameters(parameters);
                            
                // now update the user
                Element createUserIdElement = XMLUtil.selectElement(parameters, CREATE_USER_ID_XPATH);
                if(createUserIdElement == null)
                    throw new SystemException("Parameter "+CREATE_USER_ID_XPATH+" not recieved");
                
                String createUserId = createUserIdElement.getValue();
                if(createUserId == null || createUserId.length() == 0)
                    throw new SystemException("Parameter "+CREATE_USER_ID_XPATH+" is empty");
                                    
                userProfile.createUser(createUserId, courtCode, updateDetails, updateCourtDetails);
                
                response = new StringBuffer();
                response.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
                response.append("<createdUser>"+createUserId+"</createdUser>");
                return response.toString();
            }
        };
        
        return processor.invoke(cmd, userId, mac, params);
        
    }
    

    /**
     * @ejb.interface-method
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     * @jboss-net.web-method
     * @jboss-net.wsdd-operation returnQName="supsDOM"
     * @soap.method
     *
     * @param userId
     * @param mac
     * @param params
     * @return
     * @throws SystemException
     * @throws BusinessException
     */
    public String updateUser(String userId, String mac, String params) throws Exception
    {   
        MethodCommand cmd = new AbstractMethodCommand("Security", "updateUser")
        {
            public String invoke(String userId, String mac, Document parameters) 
                throws BusinessException, SystemException
            {
                StringBuffer response = null;
                Element selectedUserIdElement = XMLUtil.selectElement(parameters, "/params/param[@name='userId']");
                Element courtIdEl = XMLUtil.selectElement(parameters.getRootElement(), COURT_XPATH);
                
                if ( selectedUserIdElement == null ) {
                    throw new BusinessException("No user selected for update. \"/params/param[@name='userId']\" required");
                }
                if ( courtIdEl == null ) {
                    throw new BusinessException("No court selected for update. \"/params/param[@name='courtId']\" required");
                }
                
                String courtCode = courtIdEl.getValue();
                String selectedUserId = selectedUserIdElement.getText();
                
                UpdateUserDetails updateDetails = extractSUPSUserDetailsParameters(parameters);
                
                boolean bSelfIsAuthorized = isSelfAuthorized(updateDetails);
                
                // authorize
                if ( !authorizeSecurityMethod(userId, courtCode, selectedUserId, true, bSelfIsAuthorized) ) {
                    throw new AuthorisationException("User '"+userId+"' does not have permission to 'updateUser'");
                }
                
                // do update
                userProfile.updateUser(selectedUserId, updateDetails);
                
                // create output
                response = new StringBuffer();
                response.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
                response.append("<updatedUser>"+selectedUserId+"</updatedUser>");

                return response.toString();
            }
        };
        
        return processor.invoke(cmd, userId, mac, params);
    }
    
    /**
     * @ejb.interface-method
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     * @jboss-net.web-method
     * @jboss-net.wsdd-operation returnQName="supsDOM"
     * @soap.method
     *
     * @param userId
     * @param mac
     * @param params
     * @return
     * @throws SystemException
     * @throws BusinessException
     */
    public String insertUserCourt(String userId, String mac, String params) throws Exception
    {   
        MethodCommand cmd = new AbstractMethodCommand("Security", "insertUserCourt")
        {
            public String invoke(String userId, String mac, Document parameters) 
                throws SystemException, BusinessException
            {
                StringBuffer response = new StringBuffer();
                
                Element selectedUserIdElement = XMLUtil.selectElement(parameters, "/params/param[@name='userId']");
                Element courtIdEl = XMLUtil.selectElement(parameters.getRootElement(), COURT_XPATH);
                
                if ( selectedUserIdElement == null ) {
                    throw new BusinessException("No user selected for update. \"/params/param[@name='userId']\" required");
                }
                if ( courtIdEl == null ) {
                    throw new BusinessException("No court selected for update. \"/params/param[@name='courtId']\" required");
                }
                
                String courtCode = courtIdEl.getValue();
                String selectedUserId = selectedUserIdElement.getText();
                
                if ( !authorizeSecurityMethod(userId, courtCode, userId, true, false)) {
                    throw new AuthorisationException("Failed validation of message authentication code");
                }
                
                // get any optional/app specific user court details to be included 
                UpdateUserCourtDetails updateCourtDetails = extractSUPSUserCourtParameters(parameters);
                            
                userProfile.insertUserCourt(selectedUserId, courtCode, updateCourtDetails);
                
                response = new StringBuffer();
                response.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
                response.append("<insertedUserCourt>"+selectedUserId+"</insertedUserCourt>");
                return response.toString();
            }
        };
        return processor.invoke(cmd, userId, mac, params);
    }
    
    /**
     * @ejb.interface-method
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     * @jboss-net.web-method
     * @jboss-net.wsdd-operation returnQName="supsDOM"
     * @soap.method
     *
     * @param userId
     * @param mac
     * @param params
     * @return
     * @throws SystemException
     * @throws BusinessException
     */
    public String updateUserCourt(String userId, String mac, String params) throws Exception
    {   
        
        MethodCommand cmd = new AbstractMethodCommand("Security", "updateUserCourt")
        {
            public String invoke(String userId, String mac, Document parameters) 
                throws SystemException, BusinessException
            {
                StringBuffer response = new StringBuffer();
                
                Element selectedUserIdElement = XMLUtil.selectElement(parameters, "/params/param[@name='userId']");
                Element courtIdEl = XMLUtil.selectElement(parameters.getRootElement(), COURT_XPATH);
                
                if ( selectedUserIdElement == null ) {
                    throw new BusinessException("No user selected for update. \"/params/param[@name='userId']\" required");
                }
                if ( courtIdEl == null ) {
                    throw new BusinessException("No court selected for update. \"/params/param[@name='courtId']\" required");
                }
                
                String courtCode = courtIdEl.getValue();
                String selectedUserId = selectedUserIdElement.getText();
                
                if ( !authorizeSecurityMethod(userId, courtCode, userId, true, false)) {
                    throw new AuthorisationException("Failed validation of message authentication code");
                }
                
                // get any optional/app specific user court details to be included 
                UpdateUserCourtDetails updateCourtDetails = extractSUPSUserCourtParameters(parameters);
                            
                userProfile.updateUserCourt(selectedUserId, courtCode, updateCourtDetails);
                
                response = new StringBuffer();
                response.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
                response.append("<updatedUserCourt>"+selectedUserId+"</updatedUserCourt>");
                return response.toString();
            }
        };
        
        return processor.invoke(cmd, userId, mac, params);
    }
    
    /**
     * @ejb.interface-method
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     * @jboss-net.web-method
     * @jboss-net.wsdd-operation returnQName="supsDOM"
     * @soap.method
     *
     * @param userId
     * @param mac
     * @param params
     * @return
     * @throws SystemException
     * @throws BusinessException
     */
    public String getADUserDetails(String userId, String mac, String params) throws Exception
    {   
        MethodCommand cmd = new AbstractMethodCommand("Security", "getADUserDetails")
        {
            public String invoke(String userId, String mac, Document parameters) 
                throws SystemException
            {
                Element courtIdElement = XMLUtil.selectElement(parameters.getRootElement(), COURT_XPATH);
                if(courtIdElement == null)
                    throw new SystemException("Parameter 'courtId' not received");
                
                String courtCode = courtIdElement.getValue();
                if(courtCode == null || courtCode.length() == 0){
                    throw new SystemException("Parameter 'courtCode' is empty");
                }

                StringWriter sw = new StringWriter();
                sw.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");        
                doGetADUserDetails(parameters, sw);
                return sw.toString();                
            }
        };
        
        return processor.invoke(cmd, userId, mac, params);
    }

    /**
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
    public void getADUserDetailsLocal(String params, Writer w) throws Exception {
        
        String methodName = "getADUserDetails";
        uk.gov.dca.db.pipeline.CallStack cs = uk.gov.dca.db.pipeline.CallStack.getInstance();
        cs.push(getServiceName(), methodName, params);        
        
        doGetADUserDetails(params, w);        
        
        cs.pop();
    }

    
    /**
     * @param params
     * @param response
     * @throws JDOMException
     * @throws IOException
     * @throws SystemException
     */
    private void doGetADUserDetails(String params, Writer w) throws SystemException {
        try
        {
            SAXBuilder builder = new SAXBuilder();
            Document parameters = builder.build( new StringReader(params) );
            
            doGetADUserDetails(parameters, w);
        }
        catch (JDOMException e)
        {
            throw new SystemException(e);
        }
        catch (IOException e)
        {
            throw new SystemException(e);
        }        
    }
    
    
    /**
     * @param params
     * @param response
     * @throws JDOMException
     * @throws IOException
     * @throws SystemException
     */
    private void doGetADUserDetails(Document parameters, Writer w) throws SystemException {
        
        StringBuffer response = new StringBuffer();
        
        // now get the user details
        Element getUserIdElement = (Element) XMLUtil.selectElement(parameters, GET_USER_ID_XPATH);
        if(getUserIdElement == null)
            throw new SystemException("Parameter "+GET_USER_ID_XPATH+" not received");
        
        String getUserId = getUserIdElement.getValue();
        if(getUserId == null || getUserId.length() == 0)
            throw new SystemException("Parameter "+GET_USER_ID_XPATH+" is empty");
        
        final ADUserPersonalDetails userDetails = userProfile.getADUserDetails(getUserId); 
        // now output XML
        userDetails.outputAsXML(false,null,response);
        
        try
        {
            w.write(response.toString());
        }
        catch (IOException e)
        {
            throw new SystemException(e);
        }            
    }   
    
    /**
     * @ejb.interface-method
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     * @jboss-net.web-method
     * @jboss-net.wsdd-operation returnQName="supsDOM"
     * @soap.method
     *
     * @param user
     * @param mac
     * @param params
     * @param password
     * @return
     */
    public String getHomeCourt(String userId, String mac, String params) throws Exception 
    {
        MethodCommand cmd = new AbstractMethodCommand("Security", "getHomeCourt")
        {
            public String invoke(String userId, String mac, Document params) 
                throws SystemException
            {
                StringBuffer response = null;
                
                response = new StringBuffer();
                response.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<courtId>");
                
                String homeCourt = userProfile.getHomeCourt(userId);
                response.append(homeCourt);
                response.append("</courtId>");
                
                return response.toString();
            }
        };
        
        return processor.invoke(cmd, userId, mac, params);
    }
    
    /**
     * @ejb.interface-method
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     * @jboss-net.web-method
     * @jboss-net.wsdd-operation returnQName="supsDOM"
     * @soap.method
     *
     * @param userId
     * @param mac
     * @param params
     * @return
     * @throws SystemException
     * @throws BusinessException
     */
    public String getRoles(String userId, String mac, String params) throws Exception
    {   
        MethodCommand cmd = new AbstractMethodCommand("Security", "getRoles")
        {
            public String invoke(String userId, String mac, Document parameters) 
                throws SystemException, BusinessException
            {
                Element courtIdEl = null;
                Element userIdElement = null;
                String courtCode = null;
                
                try {
                    courtIdEl = (Element) XPath.selectSingleNode(parameters.getRootElement(), COURT_XPATH);
                    userIdElement = (Element) XPath.selectSingleNode(parameters.getRootElement(), "/params/param[@name='userId']");
                }
                catch( JDOMException e ) {
                    throw new BusinessException("Failed to process parameters: "+e.getMessage(),e);
                }
        
                if(courtIdEl == null) {
                    throw new SystemException("Parameter courtId not recieved");
                }
                if(userIdElement == null) {
                    throw new SystemException("Parameter userId not recieved");
                }
                
                courtCode = courtIdEl.getValue();
                String selectedUserId = userIdElement.getValue();
        
                if(courtCode == null)
                    throw new SystemException("Parameter courtId is empty");
                if(selectedUserId == null) {
                    throw new SystemException("Parameter userId is empty");
                }
                
                RolesOutputRenderer renderer = new RolesOutputRenderer();
                
                return renderer.doRender(userProfile.getRoles(selectedUserId, courtCode));
            }
        };
        
        return processor.invoke(cmd, userId, mac, params);
    }
    
    /**
     * @ejb.interface-method
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     * @jboss-net.web-method
     * @jboss-net.wsdd-operation returnQName="supsDOM"
     * @soap.method
     *
     * @param userId
     * @param mac
     * @param params
     * @return
     * @throws SystemException
     * @throws BusinessException
     */
    public String getAllRoles(String userId, String mac, String params) throws Exception
    {   
        MethodCommand cmd = new AbstractMethodCommand("Security", "getAllRoles")
        {
            public String invoke(String userId, String mac, Document params) 
                throws SystemException
            {
                RolesOutputRenderer renderer = new RolesOutputRenderer();
                return renderer.doRender(userProfile.getAllRoles());
            }
        };
        
        return processor.invoke(cmd, userId, mac, params);
    }
    
    /**
     * @ejb.interface-method
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     * @jboss-net.web-method
     * @jboss-net.wsdd-operation returnQName="supsDOM"
     * @soap.method
     *
     * @param userId
     * @param mac
     * @param params
     * @return
     * @throws SystemException
     * @throws BusinessException
     */
    public String updateUserRoles(String userId, String mac, String params) throws Exception
    {   
        MethodCommand cmd = new AbstractMethodCommand("Security", "updateUserRoles")
        {
            public String invoke(String userId, String mac, Document parameters) 
                throws SystemException, BusinessException
            {
                String response = null;

                List roles = new ArrayList();
                
                Element courtIdEl = XMLUtil.selectElement(parameters.getRootElement(), COURT_XPATH);
                Element selectedUserIdEl = XMLUtil.selectElement(parameters.getRootElement(), "/params/param[@name='userId']");
                
                if(courtIdEl == null)
                    throw new SystemException("Parameter courtId not recieved");
                if(selectedUserIdEl == null)
                    throw new SystemException("Parameter userId not received");
                
                String courtCode = courtIdEl.getValue();
                String selectedUserId = selectedUserIdEl.getValue(); 
        
                if(courtCode == null)
                    throw new SystemException("Parameter courtId is empty");
                if(selectedUserId == null) 
                    throw new SystemException("Parameter userId is empty");
                
                ComponentContext context = new ComponentContext();
                context.putSystemItem(IComponentContext.USER_ID_KEY, userId);
                context.putSystemItem(IComponentContext.COURT_ID_KEY, courtCode);
                
                if ( !authorize("<Security roles=\""+ADMIN_ROLE+"\"/>", context) ) {
                    throw new AuthorisationException("User '"+userId+"' does not have permission to 'updateUserRoles'");
                }
            
                
                // extract roles
                Element rolesElement = XMLUtil.selectElement(parameters.getRootElement(), "/params/param[@name='roles']/roles");
                List roleElements = rolesElement.getChildren();
                
                Iterator roleIterator = roleElements.iterator();
                while(roleIterator.hasNext()) {
                    Element roleElement = (Element) roleIterator.next();
                    String roleName = roleElement.getTextNormalize();
                    roles.add(roleName);
                }
                            
                userProfile.updateRoles(selectedUserId, courtCode, roles);
                
                return response;
            }
        };
       
        return processor.invoke(cmd, userId, mac, params);
    }

    /**
     * @ejb.interface-method
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     * @jboss-net.web-method
     * @jboss-net.wsdd-operation returnQName="supsDOM"
     * @soap.method
     *
     * @param userId
     * @param mac
     * @param params
     * @return
     * @throws SystemException
     * @throws BusinessException
     */
    public String getDefaultPrinter(String userId, String mac, String params) throws Exception 
    {
        MethodCommand cmd = new AbstractMethodCommand("Security", "getDefaultPrinter")
        {
            public String invoke(String userId, String mac, Document parameters)
                throws SystemException, BusinessException
                
            {
                StringBuffer response = null;
                
                Element selectedUserIdEl = XMLUtil.selectElement(parameters, "/params/param[@name='userId']");
                String selectedUserId = selectedUserIdEl.getValue(); 
                if(selectedUserId == null) 
                    throw new SystemException("Parameter userId is empty"); 
                
                // Make output
                response = new StringBuffer();
                response.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
                response.append("<DefaultPrinter>");
                response.append("<UserId>"+selectedUserId+"</UserId>");

                String printerName = userProfile.getUserDefaultPrinter(selectedUserId);
                
                response.append("<PrinterName>"+printerName+"</PrinterName>");
                response.append("</DefaultPrinter>");
                
                return response.toString();
            }
        };
        
        return processor.invoke(cmd, userId, mac, params);
    }

    
    /**
     * @ejb.interface-method
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     * @jboss-net.web-method
     * @jboss-net.wsdd-operation returnQName="supsDOM"
     * @soap.method
     *
     * @param userId
     * @param mac
     * @param params
     * @return
     * @throws SystemException
     * @throws BusinessException
     */
    public String setDefaultPrinter(String userId, String mac, String params) throws Exception 
    {
        MethodCommand cmd = new AbstractMethodCommand("Security", "setDefaultPrinter")
        {
            public String invoke(String userId, String mac, Document parameters)
                throws SystemException, BusinessException
            {
                StringBuffer response = new StringBuffer();
                
                Element selectedUserIdEl = XMLUtil.selectElement(parameters, "/params/param[@name='userId']");
                Element courtIdEl = XMLUtil.selectElement(parameters.getRootElement(), COURT_XPATH);
                String courtCode = courtIdEl.getValue();
                String selectedUserId = selectedUserIdEl.getValue(); 
        
                if(courtCode == null)
                    throw new SystemException("Parameter courtId is empty");
                if(selectedUserId == null) 
                    throw new SystemException("Parameter userId is empty");
                
                if ( userId.compareTo(selectedUserId) != 0 ) {
                    // must be an admin user or this is not allowed
                    ComponentContext context = new ComponentContext();
                    context.putSystemItem(IComponentContext.USER_ID_KEY, userId);
                    context.putSystemItem(IComponentContext.COURT_ID_KEY, courtCode);
                    if ( !authorize("<Security roles=\""+ADMIN_ROLE+"\"/>", context) ) {
                        throw new AuthorisationException("User '"+userId+"' does not have permission to 'setDefaultPrinter'");
                    }
                }
                
                // get the printer name
                String defaultPrinter = null;
                Element printerElement = XMLUtil.selectElement(parameters, "/params/param[@name='printer']");
                if ( printerElement != null ) {
                    defaultPrinter = printerElement.getText();
                }
                
                if ( defaultPrinter == null || defaultPrinter.length() == 0 ) {
                    throw new BusinessException("Cannot set user default printer: missing input parameter \"/params/param[@name='printer']\"");
                }
                
                // update the default printer
                userProfile.setUserDefaultPrinter(selectedUserId, defaultPrinter);
                
                // Make output
                response = new StringBuffer();
                response.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
                response.append("<DefaultPrinter>");
                response.append("<UserId>"+selectedUserId+"</UserId>");
                response.append("<PrinterName>"+defaultPrinter+"</PrinterName>");
                response.append("</DefaultPrinter>");

                return response.toString();
            }
            
        };
        
        return processor.invoke(cmd, userId, mac, params);
    }

    /**
     * @ejb.interface-method
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     * @jboss-net.web-method
     * @jboss-net.wsdd-operation returnQName="supsDOM"
     * @soap.method
     *
     * @param userId
     * @param mac
     * @param params
     * @return
     * @throws SystemException
     * @throws BusinessException
     */
    public String getPrintersList(String userId, String mac, String params) throws Exception 
    {
        MethodCommand cmd = new AbstractMethodCommand("Security", "getPrintersList")
        {
            public String invoke(String userId, String mac, Document parameters)
                throws SystemException, BusinessException
            {
                StringBuffer response = new StringBuffer();
                
                // get the list of printers
                List printers = m_printerDetailsDAO.getPrinterDetails(parameters);
                
                // Make output
                response = new StringBuffer();
                response.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
                response.append("<Printers>");
                
                PrinterDetails details = null;
                Iterator it = printers.iterator();
                while( it.hasNext() ) {
                    details = (PrinterDetails)it.next();
                    PrinterDetailsSerializer.outputXML(response, details);
                }
                
                response.append("</Printers>");
                
                return response.toString();
            }
        };
        
        return processor.invoke(cmd, userId, mac, params);
    }
    
    /**
     * @ejb.interface-method
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     * @jboss-net.web-method
     * @jboss-net.wsdd-operation returnQName="supsDOM"
     * @soap.method
     *
     * @wlws:part userId name="arg0"
     * 
     * @param userId
     * @return
     */
    public String getFullUsername(String userId) throws Exception {
        String sFullUsername = userId;
        
        if ( userId == null || userId.length() == 0 || 
                "INVALID_USER".compareTo(userId) == 0 ) 
        {
            log.error("Invalid userId provided: "+userId);
            throw new BusinessException("Invalid userId provided: "+userId);
        }
        
        return sFullUsername;
    }
    
    /**
     * @ejb.interface-method view-type="local"
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     *
     * @wlws:exclude
     * 
     * @param user
     * @param mac
     * @param params
     * @return
     */
    public boolean authenticate(String user, String password) throws SystemException, BusinessException {
        boolean bValid = false;
        
        try {
            log.debug("Authenticating "+user);
            bValid = m_authenticator.authenticate(user,password);
            log.debug("Authenticated "+user);
        }
        catch(BusinessException e) {
            log.error(e.getMessage(),e);

            SUPSLogEvent event = new SUPSLogEvent("Security Service", "User Authentication", "LOGIN", user, "Failure", "Login has been unsuccessful, invalid username or password");
            auditLog.info(event);

            // need to rollback explicitly
            m_sessionContext.setRollbackOnly();
            throw e;
        }
        catch(SystemException e) {            
        	log.error(e.getMessage(),e);

        	SUPSLogEvent event = new SUPSLogEvent("Security Service", "User Authentication", "LOGIN", user, "Failure", "Login has been unsuccessful, system exception");
            auditLog.info(event);

            // NOTE: following comment should be true but JBOSS prepends undesired text
            // to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
            // [rollback is automatic because SystemException extends RuntimeException]
            m_sessionContext.setRollbackOnly();
            throw e;
        }
        catch(RuntimeException e) {
            log.error(e.getMessage(),e);

            SUPSLogEvent event = new SUPSLogEvent("Security Service", "User Authentication", "LOGIN", user, "Failure", "Login has been unsuccessful, " + e.getMessage());
            auditLog.info(event);

            // NOTE: following comment should be true but JBOSS prepends undesired text
            // to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
            // [rollback is automatic because SystemException extends RuntimeException]
            m_sessionContext.setRollbackOnly();
            throw new SystemException("Service call 'SecurityService.authenticate' failed : " + e.getMessage(), e);
        }
        catch (Throwable e) {
            //make sure catch all other possible exceptions
            log.error(e.getMessage(),e);
            
            SUPSLogEvent event = new SUPSLogEvent("Security Service", "User Authentication", "LOGIN", user, "Failure", "Login has been unsuccessful, " + e.getMessage());
            auditLog.info(event);

            // need to rollback explicitly
            m_sessionContext.setRollbackOnly();
            throw new SystemException("Service call 'SecurityService.authenticate' failed : " + e.getMessage(), e);
        }
        return bValid;
    }
    
    /**
     * @ejb.interface-method view-type="local"
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     *
     * @wlws:exclude
     * 
     * @param user
     * @param mac
     * @param params
     * @return
     */
    public boolean validateMAC(String user, String mac, String params) throws SystemException, BusinessException {
        boolean valid = false;
        
        try {
            // generate a MAC based upon the current session key and the user Id and params
            String generatedMac = context.getMac(user, params);
            
            if(log.isDebugEnabled()) {
                log.debug("validateMAC(): Parameters received from client: " + params);
                log.debug("validateMAC(): MAC received from client: " + mac);
                log.debug("validateMAC(): MAC generated by server: " + generatedMac);
            }
        
            // compare the generated MAC with the MAC passed in the message
            if(mac != null && mac.equals(generatedMac)) {
                valid = true;
            }
        }
        catch(SystemException e) {
            log.error(e.getMessage(),e);
            // NOTE: following comment should be true but JBOSS prepends undesired text
            // to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
            // [rollback is automatic because SystemException extends RuntimeException]
            m_sessionContext.setRollbackOnly();
            throw e;
        }
        catch(RuntimeException e) {
            log.error(e.getMessage(),e);
            // NOTE: following comment should be true but JBOSS prepends undesired text
            // to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
            // [rollback is automatic because SystemException extends RuntimeException]
            m_sessionContext.setRollbackOnly();
            throw new SystemException("Service call 'SecurityBean.validateMAC' failed : " + e.getMessage(), e);
        }
        catch (Throwable e) {
            //make sure catch all other possible exceptions
            log.error(e.getMessage(),e);
            // need to rollback explicitly
            m_sessionContext.setRollbackOnly();
            throw new SystemException("Service call 'SecurityBean.validateMAC' failed : " + e.getMessage(), e);
        }
        
        return valid;
    }
    
    /**
     * @ejb.interface-method
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     * @jboss-net.web-method
     * @jboss-net.wsdd-operation returnQName="supsDOM"
     * @soap.method
     *
     * @param userId
     * @param mac
     * @param params
     * @return
     * @throws SystemException
     * @throws BusinessException
     */
    public String getUserDetails(String userId, String mac, String params) throws Exception 
    {
        MethodCommand cmd = new AbstractMethodCommand("Security", "getUserDetails")
        {
            public String invoke(String userId, String mac, Document parameters)
                throws SystemException, BusinessException
            {
                StringBuffer response = new StringBuffer();
                
                Element selectedUserIdElement = null;
                selectedUserIdElement = XMLUtil.selectElement(parameters, "/params/param[@name='userId']");
                
                if ( selectedUserIdElement == null ) {
                    throw new BusinessException("No user selected. \"/params/param[@name='userId']\" required");
                }
                
                String selectedUserId = selectedUserIdElement.getText();
                if ( selectedUserId == null || selectedUserId.length() == 0){
                    throw new BusinessException("No user selected. \"/params/param[@name='userId']\" required");
                }
                
                // do we need to get the home court too? Optional
                boolean bGetHomeCourt = false;
                Element getHomeCourtElement = null;
                String homeCourt = null;
                
                getHomeCourtElement = XMLUtil.selectElement(parameters, "/params/param[@name='getHomeCourt']");
                
                if (getHomeCourtElement != null )
                {
                    if ("true".compareToIgnoreCase(getHomeCourtElement.getText()) ==0) {
                        bGetHomeCourt = true;
                        homeCourt = userProfile.getHomeCourt(selectedUserId);
                    }
                }
                
                // get the details
                UserPersonalDetails userDetails = userProfile.getUserDetails(selectedUserId);
                
                // Make output
                response = new StringBuffer();
                response.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
                if ( userDetails != null )
                {
                    userDetails.outputAsXML(bGetHomeCourt, homeCourt, response);
                }
                else
                {
                    throw new BusinessException("Unknown user '"+userId+"'");
                }
                
                return response.toString();
            }
        };
        
        return processor.invoke(cmd, userId, mac, params);
    }
    
    /**
     * @ejb.interface-method
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     * @jboss-net.web-method
     * @jboss-net.wsdd-operation returnQName="supsDOM"
     * @soap.method
     *
     * @param userId
     * @param mac
     * @param params
     * @return
     * @throws SystemException
     * @throws BusinessException
     */
    public String getUserCourtDetails(String userId, String mac, String params) throws Exception 
    {
        MethodCommand cmd = new AbstractMethodCommand("Security", "getUserCourtDetails") 
        {
            public String invoke(String userId, String mac, Document parameters) throws SystemException, BusinessException
            {
                StringBuffer response = new StringBuffer();
                
                Element selectedUserIdElement = XMLUtil.selectElement(parameters, "/params/param[@name='userId']");
                
                if ( selectedUserIdElement == null ) {
                    throw new BusinessException("No user selected. \"/params/param[@name='userId']\" required");
                }
                
                String selectedUserId = selectedUserIdElement.getText();
                if ( selectedUserId == null || selectedUserId.length() == 0){
                    throw new BusinessException("No user selected. \"/params/param[@name='userId']\" required");
                }
                
                // get the user courts
                List userCourts = userProfile.getUserCourts(selectedUserId);
                
                // Make output
                response = new StringBuffer();
                response.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
                if ( userCourts.size() > 0 )
                {
                    Iterator it = userCourts.iterator();
                    UserCourtDetails details = null;
                    
                    response.append("<UserCourts>");
                    while(it.hasNext())
                    {
                        details = (UserCourtDetails)it.next();
                        details.outputAsXML(response);
                    }
                    response.append("</UserCourts>");
                }
                else
                {
                    throw new BusinessException("Unknown user '"+userId+"'");
                }
                
                return response.toString();
            }
        };
            
        return processor.invoke(cmd, userId, mac, params);
    }
    
    /**
     * Common helper method to extract SUPS specific user details from the request.
     * Some of these can be app specific.
     * 
     * @param parameters
     * @return
     */
    private UpdateUserDetails extractSUPSUserDetailsParameters(Document parameters)
        throws BusinessException
    {
        Element activeUserParamElement = null;
        Element styleProfileParamElement = null;
        Element accessLevelParamElement = null;
        Element titleParamElement = null;
        Element jobTitleParamElement = null;
        Element extensionParamElement = null;
        Element userShortNameParamElement = null;
        
        try {
            activeUserParamElement = (Element) XPath.selectSingleNode(parameters, "/params/param[@name='activeUserFlag']");
            styleProfileParamElement = (Element) XPath.selectSingleNode(parameters, "/params/param[@name='styleProfile']");
            accessLevelParamElement = (Element) XPath.selectSingleNode(parameters, "/params/param[@name='accessSecurityLevel']");
            titleParamElement = (Element) XPath.selectSingleNode(parameters, "/params/param[@name='title']");
            jobTitleParamElement = (Element) XPath.selectSingleNode(parameters, "/params/param[@name='jobTitle']");
            extensionParamElement = (Element) XPath.selectSingleNode(parameters, "/params/param[@name='extension']");
            userShortNameParamElement = (Element) XPath.selectSingleNode(parameters, "/params/param[@name='userShortName']");
        }
        catch(JDOMException e) {
            // In this case do not handle exception here. Params validated later.
        }
        
        String activeUser = null;
        String styleProfile = null;
        String accessLevel = null;
        String title = null;
        String extension = null;
        String userShortName = null;
        String jobTitle = null;
        boolean setStyleProfile = false;
        boolean setAccessLevel = false;
        boolean setActiveUser = false;
        boolean setTitle = false;
        boolean setExtension = false;
        boolean setUserShortName = false;
        boolean setJobTitle = false;
        
        if ( styleProfileParamElement != null ) {
            styleProfile = styleProfileParamElement.getText();
            setStyleProfile = true;
        }
        if ( accessLevelParamElement != null ) {
            accessLevel = accessLevelParamElement.getText();
            setAccessLevel = true;
        }
        if ( activeUserParamElement != null ) {
            activeUser = activeUserParamElement.getText();
            setActiveUser = true;
        }
        if ( titleParamElement != null ) {
            title = titleParamElement.getText();
            setTitle = true;
        }
        if ( jobTitleParamElement != null ) {
            jobTitle = jobTitleParamElement.getText();
            setJobTitle = true;
        }
        if ( extensionParamElement != null ) {
            extension = extensionParamElement.getText();
            setExtension = true;
        }
        if ( userShortNameParamElement != null ) {
            userShortName = userShortNameParamElement.getText();
            setUserShortName = true;
        }
        
        UpdateUserDetails supsUserDetails = new UpdateUserDetails(setStyleProfile, setAccessLevel, setActiveUser,
                setExtension, setUserShortName, setJobTitle, setTitle,
                styleProfile, accessLevel, activeUser,
                title, extension, userShortName, jobTitle);
        
        return supsUserDetails;
    }
    
    /**
     * Gets params relating to user court from the input params. All are either optional or app
     * dependent.
     * 
     * @param parameters
     * @return
     * @throws BusinessException
     */
    private UpdateUserCourtDetails extractSUPSUserCourtParameters(Document parameters)
        throws BusinessException
    {
        Element dateFromParamElement = null;
        Element dateToParamElement = null;
        Element crestStaffIdParamElement = null;
        Element crestUserIdParamElement = null;
        
        try {
            dateFromParamElement = (Element) XPath.selectSingleNode(parameters, "/params/param[@name='dateFrom']");
            dateToParamElement = (Element) XPath.selectSingleNode(parameters, "/params/param[@name='dateTo']");
            crestStaffIdParamElement = (Element) XPath.selectSingleNode(parameters, "/params/param[@name='staffId']");
            crestUserIdParamElement = (Element) XPath.selectSingleNode(parameters, "/params/param[@name='crestUserId']");
        }
        catch(JDOMException e) {
            // In this case do not handle exception here. Params validated later.
        }
        
        String dateFrom = null;
        String dateTo = null;
        String crestStaffId = null;
        String crestUserId = null;
        boolean setDateFrom = false;
        boolean setDateTo = false;
        boolean setCrestStaffId = false;
        boolean setCrestUserId = false;
        
        if ( dateFromParamElement != null ) {
            dateFrom = dateFromParamElement.getText();
            setDateFrom = true;
        }
        if ( dateToParamElement != null ) {
            dateTo = dateToParamElement.getText();
            setDateTo = true;
        }
        if ( crestStaffIdParamElement != null ) {
            crestStaffId = crestStaffIdParamElement.getText();
            setCrestStaffId = true;
        }
        if ( crestUserIdParamElement != null ) {
            crestUserId = crestUserIdParamElement.getText();
            setCrestUserId = true;
        }
        
        UpdateUserCourtDetails supsUserCourtDetails = new UpdateUserCourtDetails(
                setDateFrom, setDateTo, setCrestStaffId, setCrestUserId,
                dateFrom, dateTo, crestStaffId, crestUserId);
        
        return supsUserCourtDetails;    
    }
    
    /**
     * Returns a value indicating whether the user themselves can change their own 
     * user details.
     * @param userDetails
     * @return
     */
    private boolean isSelfAuthorized(UpdateUserDetails userDetails)
    {
        boolean bSelfIsAuthorized = true;
        
        if (userDetails.getSetActiveUser()) {
            bSelfIsAuthorized = false;
        }
        else if (userDetails.getSetAccessLevel()) {
            bSelfIsAuthorized = false;
        }
        
        return bSelfIsAuthorized;
    }
    
    /**
     * Helper method to authorize users. Admin is always authorized.
     * There are currently 3 authorization settings in the security bean:
     * - admin only
     * - admin or user themselves
     * - anyone (but don't need to call this in that case)
     * @param userId
     * @param selectedUserId
     * @param parameters
     * @param authorizedForAdmin
     * @param authorizedForSelf
     * @return
     * @throws BusinessException
     * @throws SystemException
     */
    private boolean authorizeSecurityMethod(String userId, String courtCode, String selectedUserId, boolean authorizedForAdmin, boolean authorizedForSelf)
        throws BusinessException, SystemException
    {
        boolean authorized = false;
        
        if(courtCode == null)
            throw new BusinessException("Parameter courtId is empty");
        if(selectedUserId == null) 
            throw new BusinessException("Parameter userId is empty");
        
        if ( authorizedForSelf )
        {
            if ( userId.compareTo(selectedUserId) == 0 ) 
            {
                authorized = true;
            }
        }
        
        if ( !authorized && authorizedForAdmin )
        {
            ComponentContext context = new ComponentContext();
            context.putSystemItem(IComponentContext.USER_ID_KEY, userId);
            context.putSystemItem(IComponentContext.COURT_ID_KEY, courtCode);
            
            authorized = authorize("<Security roles=\""+ADMIN_ROLE+"\"/>", context);
        }
        
        return authorized;
    }
    
    /**
     * @ejb.interface-method view-type="local"
     * @ejb.permission role-name="user"
     * @ejb.transaction type="Required"
     * @jboss-net.web-method
     * @jboss-net.wsdd-operation returnQName="supsDOM"
     * @soap.method
     *
     * @param user
     * @param mac
     * @param params
     * @param password
     * @return
     */
    
    public boolean authorize(String methodSecurityProperties, IComponentContext context ) throws BusinessException, SystemException {
        SecurityFactory factory = new SecurityFactory();
        IAuthorizationPlugin authorizer = factory.createAuthorizor();
        return authorizer.authorize(context, methodSecurityProperties);
    }

    /**
     * 
     * @ejb.interface-method
     * @ejb.permission role-name="user"
     * @ejb.transaction type="NotSupported"
     * 
     */
    public String ping() throws SystemException,
            BusinessException { 		
 		return "Ping: SecurityService is uk.gov.dca.db.security.SecurityBean";
 	}
    
    public String getServiceName(){
        return "SecurityService";        
    }
    
    private interface MethodCommand
    {
        public String invoke(String userId, String mac, Document params) throws SystemException, BusinessException;
        public String getService();
        public String getMethod();
        public String getName();
    }
    
    private abstract class AbstractMethodCommand implements MethodCommand
    {
        private final String service;
        private final String method;

        public AbstractMethodCommand(String service, String method)
        {
            this.service = service;
            this.method = method;
        }

        public String getMethod()
        {
            return method;
        }

        public String getService()
        {
            return service;
        }
        
        public String getName()
        {
            return service + "." + method;
        }
    }
    
    private class MethodProcessor
    {
        public String invoke(MethodCommand cmd, String userId, String mac, String params) throws Exception
        {
            //anyone can get the details for user courts
            try {
                
                if(!validateMAC(userId, mac, params) && securityActive)
                {
                    throw new InvalidUserSessionException("Failed validation of message authentication code", mac, context.getMac(userId,params));
                }
                
                // Decorate the request by setting the context.
                CallStack cs = CallStack.getInstance();       
                cs.push(getServiceName(), cmd.getMethod(), params);
                
                Document parameters = XMLUtil.createDocument(params);
                Filter serviceFilter = compFact.getServiceFilter();
                parameters = serviceFilter.apply(userId, parameters);
                ComponentContext context = CallStack.getInstance().peek();
                userProfile.setContext(context);
                
                String result = cmd.invoke(userId, mac, parameters);
                
                cs.pop();
                
                return result;
            }
            catch(BusinessException e) {
                log.error(e.getMessage(),e);
                // need to rollback explicitly
                m_sessionContext.setRollbackOnly();
                throw m_exceptionRewriter.rewrite(e);
            }
            catch(SystemException e) {
                log.error(e.getMessage(),e);
                // NOTE: following comment should be true but JBOSS prepends undesired text
                // to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
                // [rollback is automatic because SystemException extends RuntimeException]
                m_sessionContext.setRollbackOnly();
                throw m_exceptionRewriter.rewrite(e);
            }
            catch(RuntimeException e) {
                log.error(e.getMessage(),e);
                // NOTE: following comment should be true but JBOSS prepends undesired text
                // to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
                // [rollback is automatic because SystemException extends RuntimeException]
                m_sessionContext.setRollbackOnly();
                throw m_exceptionRewriter.rewrite( new SystemException("Service call '" + cmd.getName() + "' failed : " + e.getMessage()) );
            }
            catch (Throwable e) {
                //make sure catch all other possible exceptions
                log.error(e.getMessage(),e);
                // need to rollback explicitly
                m_sessionContext.setRollbackOnly();
                throw m_exceptionRewriter.rewrite( new SystemException("Service call '" + cmd.getName() + "' failed : " + e.getMessage()) );
            }
        }
    }
    
    private SecurityContext context = null;
    private IAuthenticator m_authenticator = null; 
    private SessionContext m_sessionContext = null;
    private UserProfile userProfile = null;
    private PrinterDetailsDAO m_printerDetailsDAO = null;
    private boolean securityActive;
    private MethodProcessor processor = new MethodProcessor();
    private ComponentFactory compFact = null;
    
    // the exception rewriter is used to rewrite exceptions from web methods in
    // order to reformat the message in a way which the client can use to handle
    // errors correctly (namely, includes exception class hierarchy)
    protected ExceptionRewriter m_exceptionRewriter = new ExceptionRewriter();
    
    private static final String ADMIN_ROLE = "admin";
    private static final String COURT_XPATH = "/params/param[@name='courtId']";
    private static final String CREATE_USER_ID_XPATH = "/params/param[@name='createUserId']";
    private static final String GET_USER_ID_XPATH = "/params/param[@name='getUserId']";
    
    private static final Log log = SUPSLogFactory.getLogger(SecurityBean.class);
    private static final Log auditLog = SUPSLogFactory.getAuditLogger(SecurityBean.class.getName());
    
}