package uk.gov.dca.db.ejb;

import java.rmi.RemoteException;
import javax.ejb.EJBException;
import javax.ejb.SessionBean;
import javax.ejb.SessionContext;
import uk.gov.dca.db.XMLService;
import uk.gov.dca.db.XMLServiceFactory;
import uk.gov.dca.db.security.SecurityService;
import uk.gov.dca.db.security.InvalidUserSessionException;
import uk.gov.dca.db.ejb.ServiceLocator;
import uk.gov.dca.db.ejb.ServiceLocatorException;
import uk.gov.dca.db.exception.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import uk.gov.dca.db.ejb.ExceptionRewriter;

/*
 * Created on 27-Jul-2004
 *
 */
/**
 * @author Michael Barker
 *
 */
public abstract class ServiceBean implements SessionBean
{
    protected transient XMLService service = null;
    protected static final Log baseLog = LogFactory.getLog(ServiceBean.class);
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
    
    public abstract String[] getMethods();
    
    public abstract String getFrameworkConfigFile();

    public abstract String getProjectConfigFile();
    
    public abstract String getServiceName();
    
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

    protected void rollback() {
    	ctx.setRollbackOnly();
    }
    
    protected void authenticate(String user, String mac, String params) throws BusinessException, SystemException {
    	try {
    		String status = (String) service.getApplicationRegistry().get("security:status");
            	        	
            if(status == null || !status.toUpperCase().equals("INACTIVE")) {
    	       	// validate the message authentication code sent with the message to check if the message is from a valid user with an active
    	       	// session
    	       	SecurityService security = (SecurityService) ServiceLocator.getInstance().getService(SecurityService.class);
    	       	if(!security.validateMAC(user, mac, params)) {
    	       		throw new InvalidUserSessionException("Failed validation of message authentication code");
    	       	}
    	    }
    	}
        catch(ServiceLocatorException e) {
         	throw new SystemException("Service failed whilst trying to validate user session: "+e.getMessage(), e);
        }
    }
}
