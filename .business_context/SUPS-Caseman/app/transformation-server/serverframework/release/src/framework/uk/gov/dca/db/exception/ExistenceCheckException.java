/*
 * Created on 20-Dec-2004
 *
 */
package uk.gov.dca.db.exception;


/**
 * This class represents an exception raised when an existence check query results in an
 * action of 'fail'
 * 
 * @author GrantM
 */
public class ExistenceCheckException extends BusinessException {

	/**
	 * 
	 */
	public ExistenceCheckException() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 */
	public ExistenceCheckException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param cause
	 */
	public ExistenceCheckException(Throwable cause) {
		super(cause);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 * @param cause
	 */
	public ExistenceCheckException(String message, Throwable cause) {
		super(message, cause);
		// TODO Auto-generated constructor stub
	}

}
