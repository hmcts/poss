package uk.gov.dca.db.security;

import uk.gov.dca.db.exception.BusinessException;

/**
 * @author Imran Patel
 *
 * @deprecated Replaced by uk.gov.dca.db.exception.AuthorisationException. 
 */
public class AuthorizationException extends BusinessException {
	/**
	 * 
	 */
	public AuthorizationException() {
		super();
	}

	/**
	 * @param message
	 */
	public AuthorizationException(String message) {
		super(message);
	}

	/**
	 * @param cause
	 */
	public AuthorizationException(Throwable cause) {
		super(cause);
	}

	/**
	 * @param message
	 * @param cause
	 */
	public AuthorizationException(String message, Throwable cause) {
		super(message, cause);
	}
}
