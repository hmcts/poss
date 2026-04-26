/*
 * Created on 08-Nov-2004
 *
 */
package uk.gov.dca.db.security;

import java.util.Properties;
import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.gov.dca.db.impl.Util;
import uk.gov.dca.db.exception.*;

import jcifs.UniAddress;
import jcifs.netbios.NbtAddress;
import jcifs.smb.NtlmPasswordAuthentication;
import jcifs.smb.SmbSession;
import jcifs.smb.SmbException;
import java.net.UnknownHostException;

/**
 * Active Directory implementation of IAuthentictor interface using JFCIS
 * @author GrantM
 */
public class ActiveDirectoryAuthenticator implements IAuthenticator {

	public static final String ACTIVE_DIRECTORY_DOMAIN = "security.active_directory.domain";
	public static final String DOMAIN_CONTROLLER_NAME = "security.active_directory.domain_controller";
	public static final String DOMAIN_RESOLVE_ORDER = "security.active_directory.resolve_order";
	public static final String ACTIVE_DIRECTORY_PROPERTIES_FILE = "active_directory_security.properties";

	private static final Log log = LogFactory.getLog(ActiveDirectoryAuthenticator.class);
	
	private Properties m_properties = new Properties();
	private String m_domain = null;
	private String m_domainControllerName = null;
	private String m_domainResolveOrder = null;
	
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
		
		m_domain = m_properties.getProperty(ACTIVE_DIRECTORY_DOMAIN);
		m_domainControllerName = m_properties.getProperty(DOMAIN_CONTROLLER_NAME);
		m_domainResolveOrder = m_properties.getProperty(DOMAIN_RESOLVE_ORDER);
		
		if ( m_domainResolveOrder != null && m_domainResolveOrder.length() > 0 )
		{
			log.debug("Setting resolve order to: "+m_domainResolveOrder );
			jcifs.Config.setProperty( "jcifs.resolveOrder", m_domainResolveOrder );
		}
	}

	/* (non-Javadoc)
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
			
		log.debug("Authenticating using Active Directory: domain="+m_domain+"; user="+userId);
		
		try {
			UniAddress domainController = null;
			
			if ( m_domainControllerName != null && m_domainControllerName.length() > 0 ) 
			{
				log.debug("Resolvinging domain controller '"+m_domainControllerName+"'");	
				domainController = UniAddress.getByName(m_domainControllerName);
				log.debug("Resolved domain controller to '"+domainController.toString()+"'");	
			}
			else {
				log.debug("Defaulting to local host domain controller'");
				domainController = new UniAddress(NbtAddress.getLocalHost());
			}
			
			NtlmPasswordAuthentication authentication =
					new NtlmPasswordAuthentication( m_domain, userId, password);
			SmbSession.logon(domainController, authentication);
			
			bValid = true;
			log.debug("Successfully authenticated using Active Directory: user="+userId);	
		} 
		catch (UnknownHostException e){
			throw new SystemException("Failed to find domain controller: "+e.getMessage(),e);
		}
		catch (SmbException e){
			log.info("Active directory authentication failed for user '"+userId+"': " +e.getMessage());
		}
		
		return bValid;
	}
}