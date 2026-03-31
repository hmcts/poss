/*
 * Created on 08-Nov-2004
 *
 */
package uk.gov.dca.db.security;

import uk.gov.dca.db.exception.BusinessException;

/**
 * An exception which can be thrown from implementations of the IMessageEncode interface.
 * @author GrantM
 *
 */
public class EncodingException extends BusinessException {

	/**
	 * 
	 */
	public EncodingException() {
		super();
	}

	/**
	 * @param message
	 */
	public EncodingException(String message) {
		super(message);
	}

	/**
	 * @param cause
	 */
	public EncodingException(Throwable cause) {
		super(cause);
	}

	/**
	 * @param message
	 * @param cause
	 */
	public EncodingException(String message, Throwable cause) {
		super(message, cause);
	}

}
