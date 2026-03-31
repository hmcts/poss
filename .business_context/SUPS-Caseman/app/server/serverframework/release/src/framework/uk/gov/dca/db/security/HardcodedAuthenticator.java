/*
 * Created on 08-Nov-2004
 *
 */
package uk.gov.dca.db.security;

import java.util.Map;
import java.util.TreeMap;

/**
 * Temporary implementation of IAuthentictor interface.
 * @author GrantM
 */
public class HardcodedAuthenticator implements IAuthenticator {

	private Map m_userInfo = new TreeMap();
	
	/**
	 * Constructor
	 */
	public HardcodedAuthenticator() {
		super();
		
		m_userInfo.put("nobody","test");
		m_userInfo.put("grantm","password1");
		m_userInfo.put("jamesb","password2");
		m_userInfo.put("id1","password");
		m_userInfo.put("id3","password");
		m_userInfo.put("id2","password");
		m_userInfo.put("id6","password");
		m_userInfo.put("id99","password");
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.security.IAuthenticator#authenticate(java.lang.String, java.lang.String)
	 */
	public boolean authenticate(String userId, String password)
		throws AuthenticationException
	{
		boolean bValid = false;
		
		if ( userId == null ) {
			throw new AuthenticationException("No userId provided");
		}
		
		if ( password == null ) {
			throw new AuthenticationException("No password provided");
		}
		
		String correctPassword = (String)m_userInfo.get(userId);
		if ( correctPassword != null ) {
			bValid = (correctPassword.compareTo(password) == 0);
		}
		
		return bValid;
	}

}
