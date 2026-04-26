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


    private static final long serialVersionUID = 1594726271874652000L;

    /**
	 * 
	 */
	public ExistenceCheckException() {
		super();
	}

	/**
	 * @param message
	 */
	public ExistenceCheckException(String message) {
		super(message);
	}

	/**
	 * @param cause
	 */
	public ExistenceCheckException(Throwable cause) {
		super(cause);
	}

	/**
	 * @param message
	 * @param cause
	 */
	public ExistenceCheckException(String message, Throwable cause) {
		super(message, cause);
	}

}
