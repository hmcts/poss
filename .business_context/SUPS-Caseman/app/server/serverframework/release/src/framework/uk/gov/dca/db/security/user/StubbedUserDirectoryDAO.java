/*
 * Created on 10-Jun-2005
 *
 */
package uk.gov.dca.db.security.user;

import java.util.Hashtable;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author JamesB
 *
 */
public class StubbedUserDirectoryDAO implements UserDirectoryDAO {

	/**
	 * 
	 */
	public StubbedUserDirectoryDAO() {
		super();
		// empty
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.security.user.UserDirectoryDAO#setEnvironment(java.util.Hashtable)
	 */
	public void setEnvironment(Hashtable env) {
		// empty

	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.security.user.UserDirectoryDAO#getPersonalDetailsForUser(java.lang.String)
	 */
	public ADUserPersonalDetails getPersonalDetailsForUser(String userId)
			throws SystemException {
		ADUserPersonalDetails details = new ADUserPersonalDetails();
		
		if ( userId.compareTo("id99") == 0 ) 
		{
			// used to test adding new user
			details.setForenames("Grant");
			details.setSurname("Miller");
			details.setUserId("id99");
			details.setDeedPak("A");
		}
		else if ( userId.compareTo("id7") == 0 )
		{
			// used to test adding new user
			details.setForenames("John");
			details.setSurname("Smith");
			details.setUserId("id7");
			details.setDeedPak("B");
		}
		else if ( userId.compareTo("id8") == 0 )
		{
			// used to test adding new user
			details.setForenames("");
			details.setSurname("Smith");
			details.setUserId("id8");
			details.setDeedPak("C");
		}
		else if ( userId.compareTo("id3") == 0 )
		{
			// used to test adding new user
			details.setForenames("Toby");
			details.setSurname("Mckenzie");
			details.setUserId("id3");
			details.setDeedPak("D");
		}
		else if ( userId.compareTo("nobody") == 0 )
		{
			// used to test existing user
			details.setForenames("");
			details.setSurname("Nobody");
			details.setUserId("nobody");
			details.setDeedPak("E");
		}
		else if ( userId.compareTo("id1") == 0 )
		{
			// used to test existing user
			details.setForenames("Imran");
			details.setSurname("Patel");
			details.setUserId("id1");
			details.setDeedPak("F");
		}
/*		else if ( userId.compareTo("id6") == 0 )
		{
			// used to test existing user
			details.setForenames("Admin");
			details.setSurname("User");
			details.setUserId("id6");
			details.setDeedPak("F");
		}*/
		else
		{
			// used to test existing user
			details.setForenames("Imran");
			details.setSurname("Patel");
			details.setUserId("id1");
			details.setDeedPak("F");
		}
		
		return details;
	}

}
