/*
 * Created on 13-Jan-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.util.ldap;

import uk.gov.dca.db.exception.BusinessException;
/**
 * @author Chris Byrom
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class UserNotFoundException extends BusinessException {

	private static final String MESSAGE_TEXT = "No user exists in Active Directory for the userID ";
	/**
	 * 
	 */
	public UserNotFoundException() {
		super(MESSAGE_TEXT);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 */
	public UserNotFoundException(String message) {
		super(MESSAGE_TEXT + message);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param cause
	 */
	public UserNotFoundException(Throwable cause) {
		super(MESSAGE_TEXT, cause);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 * @param cause
	 */
	public UserNotFoundException(String message, Throwable cause) {
		super(MESSAGE_TEXT + message, cause);
		// TODO Auto-generated constructor stub
	}

}
