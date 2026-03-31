/*
 * Created on 08-Nov-2004
 *
 */
package uk.gov.dca.db.security;

import uk.gov.dca.db.exception.BusinessException;
/**
 * @author GrantM
 *
 */
public class AuthenticationException extends BusinessException {

	/**
	 * 
	 */
	public AuthenticationException() {
		super();
	}

	/**
	 * @param message
	 */
	public AuthenticationException(String message) {
		super(message);
	}

	/**
	 * @param cause
	 */
	public AuthenticationException(Throwable cause) {
		super(cause);
	}

	/**
	 * @param message
	 * @param cause
	 */
	public AuthenticationException(String message, Throwable cause) {
		super(message, cause);
	}

}
