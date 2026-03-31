/*
 * Created on 08-Nov-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security;

import java.io.InputStream;
import java.io.IOException;
import java.util.Properties;

import uk.gov.dca.db.impl.Util;
import uk.gov.dca.db.exception.*;


/**
 * Collection of factory methods to create various concrete implementations used by the security component.
 * 
 * @author JamesB
 */
public class SecurityFactory {
	
	public static final String SECURITY_AUTHENTICATOR_CLASS = "security.authenticator.class";
	public static final String SECURITY_SESSION_KEYGENERATION_SECRET = "security.session.keygeneration.secret";
	public static final String SECURITY_PROPERTIES_FILE = "security.properties";
	
	private static final String DEFAULT_SESSIONKEY_GENERATION_SECRET = "SECRET";
	
	private Properties m_properties = new Properties();
	
	/**
	 * 
	 */
	public SecurityFactory() throws SystemException
	{
		super();
		
		InputStream propertiesStream = Util.getInputStream(SECURITY_PROPERTIES_FILE, this);
		
		try {	
			m_properties.load(propertiesStream);
		}
		catch (IOException e){
			throw new SecurityFactoryException("Unable to load security properties file '"+SECURITY_PROPERTIES_FILE+"': "+e.getMessage(), e);
		}
	}

	/**
	 * creates a security context
	 * 
	 * @return the security context
	 */
	public SecurityContext createSecurityContext() {
		String secret = m_properties.getProperty(SECURITY_SESSION_KEYGENERATION_SECRET);
		if(secret == null) {
			secret = DEFAULT_SESSIONKEY_GENERATION_SECRET;
		}
		
		return new SecurityContext(new MD5MessageEncoder(), new Base16(), secret);
	}
	
	/**
	 * creates an authenticator for authenticating users
	 * 
	 * @return
	 */
	public IAuthenticator createAuthenticator() 
		throws SecurityFactoryException
	{
		String authenticatorClasspath = m_properties.getProperty(SECURITY_AUTHENTICATOR_CLASS);
		
		try
		{
		    	Class authenticatorClass = Class.forName( authenticatorClasspath );
			    return (IAuthenticator)authenticatorClass.newInstance();
		}
		catch(ClassNotFoundException e) { throw new SecurityFactoryException("Unable to find class '"+authenticatorClasspath+"': "+e.getMessage(), e); }
		catch(InstantiationException e) { throw new SecurityFactoryException("Unable to instantiate class '"+authenticatorClasspath+"': "+e.getMessage(), e); }
		catch(IllegalAccessException e) { throw new SecurityFactoryException("Unable to instantiate class '"+authenticatorClasspath+"': "+e.getMessage(), e); }
		catch(Throwable e) { throw new SecurityFactoryException("Unknown error in SecurityFactory: "+e.getMessage(),e); }
	}
}
