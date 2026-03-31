/*
 * Created on 15-Nov-2004
 *
 */
package uk.gov.dca.db.exception;

import java.lang.Exception;

/**
 * An exception representing a system exception. Inherits from RuntimeException
 * because this means that the enclosing EJB container will automatically perform a rollback
 * and discard the bean.
 *  
 * @wsee.jaxrpc-mapping local-part="SystemException" 
 * 						namespace-uri="http://localhost:8080/ws4ee/types"
 * 
 * @author JamesB
 *
 */
public class SystemException extends Exception {
    
    private static final long serialVersionUID = 1127931142751566505L;

	/**
	 * 
	 */
	public SystemException() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 */
	public SystemException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param cause
	 */
	public SystemException(Throwable cause) {
		super(cause);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 * @param cause
	 */
	public SystemException(String message, Throwable cause) {
		super(message, cause);
		// TODO Auto-generated constructor stub
	}

}
