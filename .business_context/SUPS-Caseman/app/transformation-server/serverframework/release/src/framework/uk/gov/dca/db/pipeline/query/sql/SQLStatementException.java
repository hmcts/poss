/*
 * Created on 09-Dec-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.pipeline.query.sql;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class SQLStatementException extends SystemException {

	/**
	 * 
	 */
	public SQLStatementException() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param arg0
	 */
	public SQLStatementException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param arg0
	 */
	public SQLStatementException(Throwable cause) {
		super(cause);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 * @param cause
	 */
	public SQLStatementException(String message, Throwable cause) {
		super(message, cause);
		// TODO Auto-generated constructor stub
	}
}
