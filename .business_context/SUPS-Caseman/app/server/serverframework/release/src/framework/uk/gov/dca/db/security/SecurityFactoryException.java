/*
 * Created on 11-Nov-2004
 *
 */
package uk.gov.dca.db.security;

import uk.gov.dca.db.exception.SystemException;

/**
 * An exception for errors generate by the SecurityFactory
 * @author GrantM
 *
 */
public class SecurityFactoryException extends SystemException {

	/**
	 * 
	 */
	public SecurityFactoryException() {
		super();
	}

	/**
	 * @param message
	 */
	public SecurityFactoryException(String message) {
		super(message);
	}

	/**
	 * @param cause
	 */
	public SecurityFactoryException(Throwable cause) {
		super(cause);
	}

	/**
	 * @param message
	 * @param cause
	 */
	public SecurityFactoryException(String message, Throwable cause) {
		super(message, cause);
	}

}
