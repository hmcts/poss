/*
 * Created on 27-Jun-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security;

import org.apache.commons.logging.Log;
import uk.gov.dca.db.ejb.ExceptionRewriter;
import uk.gov.dca.db.ejb.ServiceLocator;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

import javax.ejb.CreateException;
import javax.ejb.EJBException;
import javax.ejb.SessionBean;
import javax.ejb.SessionContext;
import java.rmi.RemoteException;

/**
*
* @ejb.bean type="Stateless"
* 			 name="AuthenticationService"
*           jndi-name="AuthenticationService"
* 			 local-jndi-name="ejb/AuthenticationServiceLocal"
*           view-type="${ejb.interfaces}"
* 
* @ejb.interface service-endpoint-class="uk.gov.dca.db.security.AuthenticationServiceService"
*
* @oc4j.bean jndi-name="AuthenticationService"
*
* @ejb.ejb-external-ref view-type="local"
*						 type="Session"
*						 ref-name="ejb/SecurityServiceLocal"
*						 home="uk.gov.dca.db.security.SecurityServiceLocalHome"
*						 business="uk.gov.dca.db.security.SecurityService"
*						 link="SecurityService"
*
* @wsee.port-component name="AuthenticationServiceServicePort"
* @jboss-net.web-service urn = "Authentication"
* @jboss-net.authentication domain="other" validate-unauthenticated-calls="true"
* @jboss-net.authorization domain="other" roles-allowed="user"
*
* @soap.service urn="Authentication"
* 
* @author JamesB
*/

public class AuthenticationBean implements SessionBean {

	/**
	 * 
	 */
	public AuthenticationBean() {
		super();
		// TODO Auto-generated constructor stub
	}

	/* (non-Javadoc)
	 * @see javax.ejb.SessionBean#setSessionContext(javax.ejb.SessionContext)
	 */
	public void setSessionContext(SessionContext arg0) throws EJBException,
			RemoteException {
		sessionContext = arg0;
	}

	/* (non-Javadoc)
	 * @see javax.ejb.SessionBean#ejbRemove()
	 */
	public void ejbRemove() throws EJBException, RemoteException {
		// TODO Auto-generated method stub

	}

	/* (non-Javadoc)
	 * @see javax.ejb.SessionBean#ejbActivate()
	 */
	public void ejbActivate() throws EJBException, RemoteException {
		// TODO Auto-generated method stub

	}

	/* (non-Javadoc)
	 * @see javax.ejb.SessionBean#ejbPassivate()
	 */
	public void ejbPassivate() throws EJBException, RemoteException {
		// TODO Auto-generated method stub

	}
	
	/**
	 * 
	 * @ejb.create-method
 	 * @ejb.permission role-name="user"
 	 *
	 * @throws CreateException
	 */
	public void ejbCreate() throws CreateException {
		// empty
	}
	
	/**
     * @ejb.interface-method
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="Required"
	 * @jboss-net.web-method
	 * @jboss-net.wsdd-operation returnQName="supsDOM"
	 * @soap.method
	 *
	 * @wlws:part user name="arg0"
	 * @wlws:part password name="arg1"
     * 
     * @param user
     * @param password
     * @return
     */
	public String login(String user, String password) throws Exception 
	{
		String sessionKey = null;

		try	{		
			ServiceLocator services = ServiceLocator.getInstance();
			SecurityService security = (SecurityService) services.getService(SecurityService.class);
			
			sessionKey = security.login(user, password);
		}
		catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	sessionContext.setRollbackOnly();
        	throw m_exceptionRewriter.rewrite(e);
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	sessionContext.setRollbackOnly();
        	throw m_exceptionRewriter.rewrite(e);
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	sessionContext.setRollbackOnly();
        	throw m_exceptionRewriter.rewrite( new SystemException("Service call 'SecurityService.login' failed : " + e.getMessage(), e) );
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	sessionContext.setRollbackOnly();
            throw m_exceptionRewriter.rewrite( new SystemException("Service call 'SecurityService.login' failed : " + e.getMessage(), e) );
        }
	
		return sessionKey;
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
 		return "Ping: AuthenticationService is uk.gov.dca.db.security.AuthenticationBean";
 	}
    
	private SessionContext sessionContext = null;
	
	// the exception rewriter is used to rewrite exceptions from web methods in
	// order to reformat the message in a way which the client can use to handle
	// errors correctly (namely, includes exception class hierarchy)
    protected ExceptionRewriter m_exceptionRewriter = new ExceptionRewriter();
    
	private static final Log log = SUPSLogFactory.getLogger(AuthenticationBean.class);
}
