/*
 * Created on 05-Nov-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.impl.command;

import java.rmi.RemoteException;
import javax.ejb.CreateException;
import javax.ejb.EJBException;
import javax.ejb.SessionBean;
import javax.ejb.SessionContext;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.gov.dca.db.exception.*;

/**
 * 
 * @ejb.bean type="Stateless"
 * 			 name="CommandProcessor"
 *           jndi-name="ejb/CommandProcessor"
 *           view-type="local"
 * 
 * @author JamesB
 */
public class CommandProcessorBean implements SessionBean {

	/**
	 * EJB lifecycle method called when the bean instance is created.
	 * 
	 * @ejb.create-method
 	 * @ejb.permission role-name="user"
 	 *
	 * @throws CreateException
	 */
	public void ejbCreate() throws CreateException {
		// TODO Auto-generated method stub
	}

	/* (non-Javadoc)
	 * @see javax.ejb.SessionBean#setSessionContext(javax.ejb.SessionContext)
	 */
	public void setSessionContext(SessionContext arg0) throws EJBException,
			RemoteException {
		context = arg0;
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
	 * Processes a command as part of a new, autonomous transaction.
	 * 
	 * @ejb.interface-method view-type="local"
	 * @ejb.permission role-name="user"
	 * @ejb.transaction type="RequiresNew"
	 * 
	 * @param command
	 */
	public void processImmediate(Command command) throws BusinessException, SystemException {
		try {
			command.execute();
		}
        catch(BusinessException e) {
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	context.setRollbackOnly();
        	throw e;
        }
        catch(SystemException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	context.setRollbackOnly();
        	throw e;
        }
        catch(RuntimeException e) {
        	log.error(e.getMessage(),e);
        	// NOTE: following comment should be true but JBOSS prepends undesired text
        	// to the error msg if throw a runtime exception - therefore rollback explicitly (for now) 
        	// [rollback is automatic because SystemException extends RuntimeException]
        	context.setRollbackOnly();
        	throw new SystemException("Unexpected error while processing command: " + e.getMessage());
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	context.setRollbackOnly();
            throw new SystemException("Unexpected error while processing command: " + e.getMessage());
        }
	}
	
	private SessionContext context = null;
	private static final Log log = LogFactory.getLog(CommandProcessorBean.class);
}
