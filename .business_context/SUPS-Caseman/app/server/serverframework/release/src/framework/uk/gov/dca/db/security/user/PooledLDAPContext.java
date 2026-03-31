/*
 * Created on 03-Jun-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security.user;

import java.util.Calendar;

import javax.naming.NamingException;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.pool.PooledObject;

/**
 * Sample implementation of a PooledObject wrapper.  This class wraps an object to be pooled within an ObjectPool and provides 
 * life-cycle methods for the object whilst it is in the pool.
 * 
 * @author JamesB
 */
public class PooledLDAPContext extends InitialLdapContext implements PooledObject {


	/**
	 * Constructor
	 */
	public PooledLDAPContext(LdapContext wrappedObject, ConnectionClosedObserver observer) throws NamingException {
		super();
		connection = wrappedObject;
		this.observer = observer;
	}
	
	/* (non-Javadoc)
	 * @see java.lang.Object#finalize()
	 */
	protected void finalize() throws Throwable {
		destroy();
		super.finalize();
	}
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.util.pool.PooledObject#activate()
	 */
	public void activate() {
		active = true;
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.util.pool.PooledObject#passivate()
	 */
	public void passivate() {
		active = false;
		passivated = Calendar.getInstance();
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.util.pool.PooledObject#isValid()
	 */
	public boolean isValid() {
		boolean valid = false;
		
		// TODO: needs to check if this connection object has been flagged as having caught an exception at any point
		if((passivated.getTimeInMillis() + EXPIRY_INTERVAL < Calendar.getInstance().getTimeInMillis()) && !active) {
			valid = true;
		}
		
		return valid;
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.util.pool.PooledObject#destroy()
	 */
	public void destroy() throws SystemException {
		try {
			connection.close();
		}
		catch(NamingException e) {
			throw new SystemException("Could not close LDAP connection", e);
		}
	}
	
	/**
	 * Returns the connection to the pool
	 */
	public void close() {
		observer.notify((LdapContext) this);
	}


	private ConnectionClosedObserver observer = null;
	private LdapContext connection = null;
	private Calendar created = Calendar.getInstance();
	private Calendar passivated = Calendar.getInstance();
	private boolean active = false;
	
	private final static long EXPIRY_INTERVAL = 0;
}
