/*
 * Created on 08-Nov-2004
 *
 */
package uk.gov.dca.db.security;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.MessageFormat;
import java.util.Properties;

import jcifs.Config;
import jcifs.UniAddress;
import jcifs.smb.NtStatus;
import jcifs.smb.NtlmPasswordAuthentication;
import jcifs.smb.SmbAuthException;
import jcifs.smb.SmbException;
import jcifs.smb.SmbSession;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Active Directory implementation of IAuthentictor interface using JFCIS
 * @author GrantM
 */
public class ActiveDirectoryAuthenticator implements IAuthenticator {

	public static final String ACTIVE_DIRECTORY_DOMAIN = "jcifs.smb.client.domain";
	public static final String SUPS_DOMAIN_CONTROLLER = "sups.jcifs.domainController";
	public static final String DOMAIN_CONTROLLER_NAME = "jcifs.http.domainController";
	public static final String DOMAIN_RESOLVE_ORDER = "security.active_directory.resolve_order";
	public static final String ACTIVE_DIRECTORY_PROPERTIES_FILE = "active_directory_security.properties";

	private static final Log log = SUPSLogFactory.getLogger(ActiveDirectoryAuthenticator.class);
	
	private Properties m_properties = new Properties();
	private String[] hosts;
	private String m_domain;
	
	/**
	 * Constructor
	 */
	public ActiveDirectoryAuthenticator() 
		throws SystemException
	{
		super();

		InputStream propertiesStream = Util.getInputStream(ACTIVE_DIRECTORY_PROPERTIES_FILE, this);
		try {
			m_properties.load(propertiesStream);
		}
		catch(IOException e) {
			throw new SystemException("Failed to read active directory properties file '"+ACTIVE_DIRECTORY_PROPERTIES_FILE+"': "+e.getMessage(), e);
		}
		
        Config.setProperties(m_properties);
        
		m_domain = m_properties.getProperty(ACTIVE_DIRECTORY_DOMAIN);
		String hostlist = m_properties.getProperty(SUPS_DOMAIN_CONTROLLER, m_domain);
		if (hostlist != null && hostlist.trim().length() > 0)
		{
			hosts = hostlist.split(",");
		}
		else
		{
			throw new SystemException("'" + ACTIVE_DIRECTORY_DOMAIN + "' is not defined");
		}
	}
	
	public boolean adLogin(InetAddress addr, String userId, String password) throws AuthenticationException
	{
		
		log.debug("Authenticating using Active Directory domain = " +m_domain + ", host = " + addr + ", user = " + userId);
		
		boolean result = false;
		try
		{
			UniAddress domainController = new UniAddress(addr);
			NtlmPasswordAuthentication authentication =
					new NtlmPasswordAuthentication( m_domain, userId, password);
			SmbSession.logon(domainController, authentication);
			
			result = true;
			log.debug("Successfully authenticated using Active Directory: user="+userId);							
		}
		catch (SmbAuthException e) 
		{
            int errorCode = e.getNtStatus();
            if (isPassableError(errorCode))
            {
                log.warn("Exception was thrown but the error code: " + errorCode + " is still acceptable for login");
                result = true;
            }
            else
            {
                String message = getErrorMessage(errorCode);
                log.error("Login Failed for user: '" + userId + "'. Reason: " + message);
                log.error(e);
                throw new AuthenticationException(MessageFormat.format(AUTH_FAILURE_MSG, new Object[] { userId }));                
            }
		}							
		catch (SmbException e) 
		{
            int errorCode = e.getNtStatus();
            if (isPassableError(errorCode))
            {
                log.warn("Exception was thrown but the error code: " + errorCode + " is still acceptable for login");
                result = true;
            }
            else
            {
                String message = getErrorMessage(errorCode);
                log.error("Failed to connect to domain controller: '" + addr.toString() + "'. Reason: " + message);
            }
		}
		
		return result;
	}

	/**
	 * Implements authentication against a single or mulitple AD 
	 * controllers.
	 * 
	 * @see uk.gov.dca.db.security.IAuthenticator#authenticate(java.lang.String, java.lang.String)
	 */
	public boolean authenticate(String userId, String password)
		throws AuthenticationException, SystemException
	{
		boolean bValid = false;
		
		if ( userId == null ) {
			throw new AuthenticationException("No userId provided");
		}
		
		if ( password == null ) {
			throw new AuthenticationException("No password provided");
		}
		
		for (int i = 0; i < hosts.length && !bValid; i++)
		{
			String host = hosts[i];
			
			try 
			{
				InetAddress[] addrs = InetAddress.getAllByName(host);
				for (int j = 0; j < addrs.length && !bValid; j++)
				{
					InetAddress addr = addrs[j];
					
					bValid = adLogin(addr, userId, password);
				}
			} 
			catch (UnknownHostException e) 
			{
				log.error("Unable to resolve hostname '" + host + "'. " + e.getMessage());
			}
		}
		
		if (!bValid)
		{
            log.error("Login Failed for user: '" + userId + "'. Reason: Failed to locate a valid AD Controller");			
            throw new AuthenticationException(MessageFormat.format(AUTH_FAILURE_MSG, new Object[] { userId }));                
		}
		
		return bValid;
	}
	
	
    
    private final static int NT_STATUS_PASSWORD_MUST_CHANGE = 0xC0000224;
    
    /**
     * Some NT_STATUS codes are allowed to log in.
     * 
     * @param errorCode
     * @return
     */
    private boolean isPassableError(int errorCode) 
    {
        switch (errorCode) 
        {
        case NT_STATUS_PASSWORD_MUST_CHANGE:
            return true;
        default:
            return false;
        }
    }
    
    /**
     * Returns the string that contains the actual reason why the user could not
     * be logged in
     * 
     * @param errorCode
     * @return
     */
    private String getErrorMessage(int errorCode)
    {
        // TODO: This could be optimised, but probably not really and issue.
        for (int i = 0; i < NtStatus.NT_STATUS_CODES.length; i++)
        {
            if (NtStatus.NT_STATUS_CODES[i] == errorCode)
            {
                return NtStatus.NT_STATUS_MESSAGES[i];
            }
        }
        return "Unknown-" + errorCode;
    }
	
	public Properties getProperties(){
	   return m_properties;
	}
}