/*
 * Created on 03-Jun-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security.user;

import javax.naming.ldap.LdapContext;
import uk.gov.dca.db.util.pool.ObjectPool;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class PoolReturner implements ConnectionClosedObserver {

	/**
	 * 
	 */
	public PoolReturner(ObjectPool pool) {
		super();
		this.pool = pool;
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.security.user.ConnectionClosedObserver#notify(uk.gov.dca.db.security.user.LDAPConnection)
	 */
	public void notify(LdapContext connection) {
		pool.returnObject((PooledLDAPContext) connection);
	}

	private ObjectPool pool = null;
}
