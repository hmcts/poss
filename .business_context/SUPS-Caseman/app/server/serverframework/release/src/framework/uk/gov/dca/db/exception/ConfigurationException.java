/*
 * Created on 20-Dec-2004
 *
 */
package uk.gov.dca.db.exception;


/**
 * This class represents an exception raised when an error in the framework configuration
 * prevents further processing.
 * 
 * @author GrantM
 */
public class ConfigurationException extends SystemException {

	
    private static final long serialVersionUID = -9218253898145751120L;

    /**
	 * 
	 */
	public ConfigurationException() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 */
	public ConfigurationException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param cause
	 */
	public ConfigurationException(Throwable cause) {
		super(cause);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 * @param cause
	 */
	public ConfigurationException(String message, Throwable cause) {
		super(message, cause);
		// TODO Auto-generated constructor stub
	}

}
