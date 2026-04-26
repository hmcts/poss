/*
 * Created on 06-Dec-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.ejb.filter;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class FiltrationException extends SystemException {

    private static final long serialVersionUID = 7710204157012139849L;

    /**
	 * 
	 */
	public FiltrationException() {
		super();
	}

	/**
	 * @param message
	 */
	public FiltrationException(String message) {
		super(message);
	}

	/**
	 * @param cause
	 */
	public FiltrationException(Throwable cause) {
		super(cause);
	}

	/**
	 * @param message
	 * @param cause
	 */
	public FiltrationException(String message, Throwable cause) {
		super(message, cause);
	}

}
