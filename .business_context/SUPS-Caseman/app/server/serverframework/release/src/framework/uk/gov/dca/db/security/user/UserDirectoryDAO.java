/*
 * Created on 08-Jun-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security.user;

import java.util.Hashtable;

import uk.gov.dca.db.exception.SystemException;

/**
 * Interface defining operations for retrieving user personal details from a directory server.  Implementations 
 * this interface will be provided by project teams
 * 
 * @author JamesB
 */
public interface UserDirectoryDAO {
	/**
	 * Sets the environment properties that should be used to access the directory server
	 * 
	 * @param env A Hashtable containing environment properties used to connect to the directory server
	 */
	public void setEnvironment(Hashtable env);
	
	/**
	 * Retrieves a populated UserPersonalDetails object from the Directory server
	 * 
	 * @param userId the user id of the user whose details are to be retrieved
	 * @return ADUserPersonalDetails object populated with the user's details
	 * @throws SystemException if an exception occurs trying to access the directory
	 */
	public ADUserPersonalDetails getPersonalDetailsForUser(String userId) throws SystemException;
}
