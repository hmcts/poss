/*
 * Created on 08-Nov-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security;

import java.rmi.RemoteException;
import javax.ejb.CreateException;
import javax.ejb.EJBException;
import javax.ejb.SessionBean;
import javax.ejb.SessionContext;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import uk.gov.dca.db.exception.*;
import uk.gov.dca.db.ejb.ExceptionRewriter;

/**
 *
 * @ejb.bean type="Stateless"
 * 			 name="SecurityService"
 *           jndi-name="ejb/SecurityService"
 *           view-type="all"
 * 
 * @ejb.interface service-endpoint-class="uk.gov.dca.db.security.SecurityServiceService"
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
	
	/**
	 * 
	 * @ejb.create-method
 	 * @ejb.permission role-name="user"
 	 *
	 * @throws CreateException
	 */
	public void ejbCreate() throws CreateException {
		try {
			SecurityFactory factory = new SecurityFactory(); 
			context = factory.createSecurityContext();
			m_authenticator = factory.createAuthenticator();
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
		String sSessionKey = null;

		try	{		
			boolean bValid = authenticate(user,password);
			
			if (bValid ) {
				// generate and cache the session key
				sSessionKey = context.getSessionKey(user);
					
				if(log.isDebugEnabled()) {
					log.debug("login(): " + user + " successfully authenticated");
					log.debug("login(): " + user + " allocated session key: " + sSessionKey);
				}
			}
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
        	throw m_exceptionRewriter.rewrite( new SystemException("Service call 'SecurityService.login' failed : " + e.getMessage()) );
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	m_sessionContext.setRollbackOnly();
            throw m_exceptionRewriter.rewrite( new SystemException("Service call 'SecurityService.login' failed : " + e.getMessage()) );
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
        	// need to rollback explicitly
        	m_sessionContext.setRollbackOnly();
        	throw e;
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
        	throw new SystemException("Service call 'SecurityService.authenticate' failed : " + e.getMessage());
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	m_sessionContext.setRollbackOnly();
            throw new SystemException("Service call 'SecurityService.authenticate' failed : " + e.getMessage());
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
	    catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	m_sessionContext.setRollbackOnly();
        	throw e;
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
        	throw new SystemException("Service call 'SecurityBean.validateMAC' failed : " + e.getMessage());
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	m_sessionContext.setRollbackOnly();
            throw new SystemException("Service call 'SecurityBean.validateMAC' failed : " + e.getMessage());
        }
        
		return valid;
	}
	
	private SecurityContext context = null;
	private IAuthenticator m_authenticator = null; 
	private SessionContext m_sessionContext = null;
	
	// the exception rewriter is used to rewrite exceptions from web methods in
	// order to reformat the message in a way which the client can use to handle
	// errors correctly (namely, includes exception class hierarchy)
    protected ExceptionRewriter m_exceptionRewriter = new ExceptionRewriter();
	
	private static final Log log = LogFactory.getLog(SecurityBean.class);
}