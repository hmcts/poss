/*
 * Created on 15-Nov-2004
 *
 */
package uk.gov.dca.db.exception;

/**
 * A class representing a business (aka application) exception.
 * 
 * @wsee.jaxrpc-mapping local-part="BusinessException" 
 * 						namespace-uri="http://localhost:8080/ws4ee/types"
 * 
 * @author JamesB
 */
public class BusinessException extends Exception {

    private static final long serialVersionUID = -5363499430477102865L;

    /**
	 * 
	 */
	public BusinessException() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 */
	public BusinessException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param cause
	 */
	public BusinessException(Throwable cause) {
		super(cause);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 * @param cause
	 */
	public BusinessException(String message, Throwable cause) {
		super(message, cause);
		// TODO Auto-generated constructor stub
	}

}
