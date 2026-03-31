/*
 * Created on 02-Jun-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security.user;

import uk.gov.dca.db.util.pool.ObjectPool;
import uk.gov.dca.db.util.pool.PooledObject;
import uk.gov.dca.db.util.pool.PooledObjectFactory;
import uk.gov.dca.db.util.pool.PooledObjectInstantiationException;

import javax.naming.NamingException;
import javax.naming.ldap.InitialLdapContext;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class LDAPConnectionFactory implements PooledObjectFactory {

	/**
	 * Constructor
	 */
	public LDAPConnectionFactory() {
		super();
	}

	/**
	 * @see uk.gov.dca.db.util.pool.PooledObjectFactory#create()
	 */
	public PooledObject create(ObjectPool pool) throws PooledObjectInstantiationException {
		PooledLDAPContext product = null;
		
		try {
			product = new PooledLDAPContext(new InitialLdapContext(), new PoolReturner(pool));
		}
		catch(NamingException e) {
			throw new PooledObjectInstantiationException("Could not instantiate new LdapContext", e);
		}
		
		return product;
	}

}
