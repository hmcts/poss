/*
 * Created on 08-Jun-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security.user;

import javax.naming.ldap.LdapContext;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.pool.ObjectPool;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class LDAPDatasource {
	
	public LDAPDatasource(ObjectPool connectionPool) {
		super();
		this.connectionPool = connectionPool;
	}
	
	public LdapContext getConnection() throws SystemException {
		return (LdapContext) connectionPool.borrowObject();
	}
	
	private ObjectPool connectionPool = null;
}
