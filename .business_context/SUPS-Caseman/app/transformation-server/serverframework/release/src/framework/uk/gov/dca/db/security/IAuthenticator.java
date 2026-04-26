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
	public boolean authenticate(String userId, String password) throws BusinessException, SystemException;
}
