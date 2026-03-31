/*
 * Created on 20-Dec-2004
 *
 */
package uk.gov.dca.db.exception;


/**
 * This class represents an exception raised when a validation of input data fails
 * 
 * @author GrantM
 */
public class ValidationException extends BusinessException {

	
    private static final long serialVersionUID = 7147667764508630708L;

    /**
	 * 
	 */
	public ValidationException() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 */
	public ValidationException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param cause
	 */
	public ValidationException(Throwable cause) {
		super(cause);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 * @param cause
	 */
	public ValidationException(String message, Throwable cause) {
		super(message, cause);
		// TODO Auto-generated constructor stub
	}

}
