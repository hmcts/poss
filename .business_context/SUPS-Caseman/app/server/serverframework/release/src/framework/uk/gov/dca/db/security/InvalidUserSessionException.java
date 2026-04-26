/*
 * Created on 09-Nov-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security;
import uk.gov.dca.db.exception.BusinessException;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class InvalidUserSessionException extends BusinessException {

	/**
	 * 
	 */
	public InvalidUserSessionException() {
		super();
	}

	/**
	 * @param message
	 */
	public InvalidUserSessionException(String message, String inMAC, String localMAC) {
		super(message + "; MAC IN: " + inMAC + "; MAC GEN: " + localMAC);
	}

    public InvalidUserSessionException(String message, String inMAC) {
        super(message + "; MAC IN: " + inMAC);
    }

    public InvalidUserSessionException(String message) {
        super(message);
    }

	/**
	 * @param cause
	 */
	public InvalidUserSessionException(Throwable cause) {
		super(cause);
	}

	/**
	 * @param message
	 * @param cause
	 */
	public InvalidUserSessionException(String message, Throwable cause) {
		super(message, cause);
	}

}
