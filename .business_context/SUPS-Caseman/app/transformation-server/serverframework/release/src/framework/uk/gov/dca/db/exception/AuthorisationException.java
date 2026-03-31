/*
 * Created on 20-Dec-2004
 *
 */
package uk.gov.dca.db.exception;


/**
 * This class represents an exception raised when a user fails authorisation
 * 
 * @author GrantM
 */
public class AuthorisationException extends BusinessException {

	/**
	 * 
	 */
	public AuthorisationException() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 */
	public AuthorisationException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param cause
	 */
	public AuthorisationException(Throwable cause) {
		super(cause);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 * @param cause
	 */
	public AuthorisationException(String message, Throwable cause) {
		super(message, cause);
		// TODO Auto-generated constructor stub
	}

}
