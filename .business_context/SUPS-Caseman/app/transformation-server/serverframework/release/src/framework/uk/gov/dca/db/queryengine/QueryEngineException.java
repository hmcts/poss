/*
 * Created on 22-Sep-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.queryengine;

import uk.gov.dca.db.exception.SystemException;

/**
 * This exception is used to raise system style errors that have occurred within the 
 * QueryDefParser. ConfigurationException should be used if the configuration being validated
 * is itself at fault. 
 * 
 * @author GrantM
 */
public class QueryEngineException extends SystemException {

	/**
	 * 
	 */
	public QueryEngineException() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 */
	public QueryEngineException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param cause
	 */
	public QueryEngineException(Throwable cause) {
		super(cause);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 * @param cause
	 */
	public QueryEngineException(String message, Throwable cause) {
		super(message, cause);
		// TODO Auto-generated constructor stub
	}

}
