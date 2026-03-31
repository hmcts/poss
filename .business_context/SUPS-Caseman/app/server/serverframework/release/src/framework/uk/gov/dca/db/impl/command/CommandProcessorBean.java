/*
 * Created on 05-Nov-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.impl.command;

import org.apache.commons.logging.Log;
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
 * 			 name="CommandProcessor"
 *           jndi-name="ejb/CommandProcessor"
 * 			 local-jndi-name="ejb/CommandProcessorLocal"
 *           view-type="${ejb.interfaces}"
 * 
 * @oc4j.bean jndi-name="CommandProcessor"
 * 
 * @ejb.ejb-external-ref view-type="local"
 *						 type="Session"
 *						 ref-name="ejb/CommandProcessorLocal"
 *						 home="uk.gov.dca.db.impl.command.CommandProcessorLocalHome"
 *						 business="uk.gov.dca.db.impl.command.CommandProcessor"
 *						 link="CommandProcessor"
 * 
 * @author JamesB
 */
public class CommandProcessorBean implements SessionBean {

    
    private static final long serialVersionUID = 720530040270876151L;
    
    /**
	 * EJB lifecycle method called when the bean instance is created.
	 * 
	 * @ejb.create-method
 	 * @ejb.permission role-name="user, checker"
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
	 * @ejb.interface-method view-type="${ejb.interfaces}"
	 * @ejb.permission role-name="user, checker"
	 * @ejb.transaction type="RequiresNew"
	 * 
	 * @param command
	 */
	public void processImmediate(Command command) throws BusinessException, SystemException {
		try {
            if(log.isDebugEnabled()){
                log.debug("Command value is: "+command);
                log.debug("Command class is: "+command.getClass().getName());
            }
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
        	throw new SystemException("Unexpected error while processing command: " + e.getMessage(), e);
        }
        catch (Throwable e) {
        	//make sure catch all other possible exceptions
        	log.error(e.getMessage(),e);
        	// need to rollback explicitly
        	context.setRollbackOnly();
            throw new SystemException("Unexpected error while processing command: " + e.getMessage(), e);
        }
	}
	
	private SessionContext context = null;
	private static final Log log = SUPSLogFactory.getLogger(CommandProcessorBean.class);
}
