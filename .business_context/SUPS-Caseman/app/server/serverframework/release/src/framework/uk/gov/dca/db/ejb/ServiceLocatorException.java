/*
 * Created on 09-Nov-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.ejb;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class ServiceLocatorException extends SystemException {

	
    private static final long serialVersionUID = 2244909827254728558L;

    /**
	 * 
	 */
	public ServiceLocatorException() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 */
	public ServiceLocatorException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param cause
	 */
	public ServiceLocatorException(Throwable cause) {
		super(cause);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 * @param cause
	 */
	public ServiceLocatorException(String message, Throwable cause) {
		super(message, cause);
		// TODO Auto-generated constructor stub
	}

}
