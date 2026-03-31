/*
 * Created on 26-May-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security.serversecret;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * @author Imran Patel
 */

public interface SecretServer {
	/**
	 * This method will return the current server secret if it has not expired.  However, if it has expired it will return a new one.
	 * 
	 * @return String containing a valid server secret
	 */
	public String getSecret() throws BusinessException, SystemException;
}
