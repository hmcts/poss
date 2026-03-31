/*
 * Created on 27-Oct-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.pipeline;

import uk.gov.dca.db.exception.SystemException;


/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class LockingException extends SystemException {

	/**
	 * 
	 */
	public LockingException() {
		super();
	}

	/**
	 * @param message
	 */
	public LockingException(String message) {
		super(message);
	}

	/**
	 * @param cause
	 */
	public LockingException(Throwable cause) {
		super(cause);
	}

	/**
	 * @param message
	 * @param cause
	 */
	public LockingException(String message, Throwable cause) {
		super(message, cause);
	}

}
