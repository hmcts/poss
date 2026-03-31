/*
 * Created on 08-Nov-2004
 *
 */
package uk.gov.dca.db.security;

import uk.gov.dca.db.exception.*;

/**
 * Interface to abstract the user authentication mechanism.
 * 
 * @author GrantM
 *
 */
public interface IAuthenticator {
    
    public static final String AUTH_FAILURE_MSG = "Active Directory authentication failed for user: {0}, access denied";
    
	public boolean authenticate(String userId, String password) throws BusinessException, SystemException;
}
