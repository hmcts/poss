/*
 * Created on 10-Jun-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.test_project.common.security;

import uk.gov.dca.db.security.user.UserDirectoryDAO;
import uk.gov.dca.db.security.user.UserPersonalDetails;
import uk.gov.dca.db.security.user.ADUserPersonalDetails;
import java.util.Hashtable;
import java.text.MessageFormat;
import uk.gov.dca.db.exception.SystemException;

import javax.naming.NamingEnumeration;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.Control;
import javax.naming.ldap.LdapContext;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.NamingException;
//import com.sun.jndi.ldap.ctl.PagedResultsControl;

/**
 * @author IanW
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */

public class TestAppsUserDirectoryDAO implements UserDirectoryDAO {
	
	private static String AD_UNAVAILABLE = "The server cannot connect to Active Directory at the moment. Please try again later.";
	private static String USER_NOT_FOUND = "User does not exist in Active Directory";
	private static final String FORENAME = "givenname";
	private static final String SURNAME = "sn";
	private static final String SEARCHBASE_KEY = "searchbase";
	public final static String QUERY_KEY = "query";
	private static final String[] RETURN_ATTRIBUTES = new String[] {FORENAME, SURNAME};
	
	private Hashtable connectionEnv = null;
	private String searchBase = null;
	private String query = null;
	
	public TestAppsUserDirectoryDAO() 
	{
		super();	
	}
	
	public void setEnvironment(Hashtable env) 
	{
		connectionEnv = (Hashtable)env.clone();
		searchBase = (String)connectionEnv.get(SEARCHBASE_KEY);
		query = (String)connectionEnv.get(QUERY_KEY);
		connectionEnv.remove(SEARCHBASE_KEY);
		connectionEnv.remove(QUERY_KEY);	
	}
	
	public ADUserPersonalDetails getPersonalDetailsForUser(String userId) throws SystemException 
	{
		//obtain an LDAP connection to Active Directory
		LdapContext con = null;
		try
		{
			con = new InitialLdapContext(connectionEnv, null);
		}
		catch(NamingException e)
		{
	
			throw new SystemException(AD_UNAVAILABLE);
		}

		//use the connection to retrieve the user from AD
		ADUserPersonalDetails details = new ADUserPersonalDetails();

		try {
//			Set up LDAP search params 
			SearchControls constraints = new SearchControls();
			constraints.setSearchScope(SearchControls.SUBTREE_SCOPE);
			constraints.setReturningAttributes(RETURN_ATTRIBUTES);
						
			// Limit the search to 1 result
	//		Control[] cts = new Control[] { new PagedResultsControl(1) };
	//		con.setRequestControls(cts);
			
			System.out.println("Userid is: " + userId);
			System.out.println("Query is: " + query);
			
			String filter = MessageFormat.format(query, new String[] { userId });
			
			//do the search on AD and extract the displayname from the results
			NamingEnumeration results = con.search(searchBase, filter, constraints);
			String displayName;
			
			if (results != null &&  results.hasMore()) {
				//there should only be one result so use the first one
				SearchResult sr = (SearchResult)results.next();
				Attributes attrs = sr.getAttributes();
				Attribute forenameAttr = attrs.get(FORENAME);
				System.out.println("Forename is: " + (String)forenameAttr.get());
				details.setForenames((String)forenameAttr.get());	
				Attribute surnameAttr = attrs.get(SURNAME);
				System.out.println("Surname is: " + (String)surnameAttr.get());
				details.setSurname((String)surnameAttr.get());
				
				details.setUserId(userId);
				
				
			}
			else {
				
				throw new SystemException(USER_NOT_FOUND);
			}
			
			/*
			details.setExtension("");
			details.setJobTitle("");
			details.setRemoteUser(Boolean.TRUE);
			details.setStaffId("");
			details.setTitle("");
			details.setUserId(userId);
			details.setUserShortName("");
			*/
			
			return details;
			
		}
		
		catch (NamingException ne){
			throw new SystemException(ne.getMessage());
		}
		finally {
			if (con != null){
				try {
					con.close();
				}
				catch (NamingException ne){}
			}
		} 
	} // getPersonalDetailsForUser
	
	/* STUB
	public UserPersonalDetails getPersonalDetailsForUser(String userId) throws SystemException 
	{
	UserPersonalDetails details = new UserPersonalDetails();
	
	System.out.println("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
	System.out.println("userId is: " + userId);
	System.out.println("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
	
	//userId.toLowerCase()
	
	details.setExtension("0898");
	details.setForenames("David");
	details.setJobTitle("Configger");
	details.setRemoteUser(Boolean.TRUE);
	details.setStaffId("h4ck3r");
	details.setSurname("Page");
	details.setTitle("Ms");
	details.setUserId(userId);
	details.setUserShortName("Bob");
	
	return details;
	}
	*/

}