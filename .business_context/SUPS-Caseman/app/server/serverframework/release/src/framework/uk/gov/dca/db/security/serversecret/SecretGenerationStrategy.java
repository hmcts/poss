package uk.gov.dca.db.security.serversecret;

import java.util.Calendar;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author Imran Patel
 *
 */

public interface SecretGenerationStrategy {
	/**
	 * Generates a base 16 encoded, byte array of a random length
	 * 
	 * @return String containing the byte array encoded in base 16
	 * @throws SystemException
	 */
	public String generateSecret() throws SystemException;
	
	public Calendar getNewExpiryDate();
}
