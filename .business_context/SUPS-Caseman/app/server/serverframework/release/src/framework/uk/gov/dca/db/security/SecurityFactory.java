/*
 * Created on 08-Nov-2004
 */
package uk.gov.dca.db.security;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.StringConfigurationItem;
import uk.gov.dca.db.impl.Util;
import uk.gov.dca.db.security.authorization.DBUserProfile;
import uk.gov.dca.db.security.authorization.IAuthorizationPlugin;
import uk.gov.dca.db.security.authorization.RolesBuilder;
import uk.gov.dca.db.security.authorization.UserProfile;
import uk.gov.dca.db.security.printers.PrinterDetailsDAO;
import uk.gov.dca.db.security.serversecret.SecretManager;
import uk.gov.dca.db.security.serversecret.SecretServer;
import uk.gov.dca.db.security.user.UserDirectoryDAO;
import uk.gov.dca.db.util.ClassUtil;
import uk.gov.dca.db.util.ConfigUtil;
import uk.gov.dca.db.util.FrameworkConfigParam;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Collection of factory methods to create various concrete implementations used by the security component.
 * 
 * @author JamesB
 */
public class SecurityFactory {
	private static final Log log = SUPSLogFactory.getLogger(SecurityFactory.class);
	
	// property keys
	// ...for the rest of security
	public static final String SECURITY_AUTHENTICATOR_CLASS = "security.authenticator.class";
	public static final String SECURITY_LDAP_DAO_CLASS = "security.ldap.dataaccess.class";
	public static final String SECURITY_LDAP_CONNECTION_PROPERTIES = "security.ldap.connection.properties.file";
	public static final String SECURITY_AUTHORIZER_CLASS = "security.authorizer.class";
	public static final String SECURITY_DATASOURCE_ID = "security.session.keygeneration.secret.datasource";
	public static final String SECURITY_PROPERTIES_FILE = "security.properties";
	public static final String SECURITY_SECRET_INTERVAL = "security.session.keygeneration.secret.interval";
	public static final String SECURITY_SECRET_INTERVAL_TYPE = "security.session.keygeneration.secret.interval.type";
	public static final String SECURITY_ROLES_XML = "security.authorization.roles.xml";
	public static final String PRINTERS_DAO_CLASS = "printers.ldap.dataaccess.class";
	public static final String PRINTERS_LDAP_CONNECTION_PROPERTIES = "printers.ldap.connection.properties.file";
	public static final String SECURITY_ACTIVE = "security.active";
    
    /**
     * The key used to look up an overriding security DataSource Id in
     * the project-config.
     */
    private final static String SECURITY_DATASOURCE_ID_OVERRIDE_KEY
            = "security:dataSource";
	
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
        
        // Defect 1110 - look for an override DataSource id in project config:
        String dataSourceId = m_properties.getProperty(SECURITY_DATASOURCE_ID);
        ConfigUtil config = ConfigUtil.create(
                FrameworkConfigParam.PROJECT_CONFIG.getValue());
        Object dataSourceIdOverride = config.getConfig()
                .get(SECURITY_DATASOURCE_ID_OVERRIDE_KEY);
        String overrideIdValue = null;
        if (dataSourceIdOverride instanceof StringConfigurationItem) {
            overrideIdValue = (String)((StringConfigurationItem)dataSourceIdOverride).get();
            m_properties.put(SECURITY_DATASOURCE_ID, overrideIdValue);
        }
        if (log.isDebugEnabled()) {
            if (overrideIdValue != null) {
                log.debug("Security datasource id \"" + dataSourceId + "\" "
                        + "overridden in project-config. "
                        + "Using JNDI id \"" + overrideIdValue + "\".");
            }
            else {
                log.debug("Security datasource id not "
                        + "overridden in project-config. "
                        + "Using JNDI id \"" + dataSourceId + "\".");
            }
        }
	}

	public String getRolesXMLLocation() {
		return m_properties.getProperty(SECURITY_ROLES_XML);
	}
	
	/**
	 * creates a security context
	 * 
	 * @return the security context
	 * @throws SystemException
	 * @throws BusinessException
	 */
	public SecurityContext createSecurityContext() throws BusinessException, SystemException {
		SecretServer secret = createSecretServer(new Base16());
		
		return new SecurityContext(new MD5MessageEncoder(), new Base16(), secret);
	}
	
	
	/**
	 * creates a security context
	 * 
	 * @return the authorization plugin
	 * @throws SystemException
	 * @throws BusinessException
	 */
	public IAuthorizationPlugin createAuthorizor() throws SecurityFactoryException
	{
		String authorizerClasspath = m_properties.getProperty(SECURITY_AUTHORIZER_CLASS);
		
		try
		{
		    	Class authorizerClass = ClassUtil.loadClass( authorizerClasspath );
			    return (IAuthorizationPlugin)authorizerClass.newInstance();
		}
		catch(ClassNotFoundException e) { throw new SecurityFactoryException("Unable to find class '"+authorizerClasspath+"': "+e.getMessage(), e); }
		catch(InstantiationException e) { throw new SecurityFactoryException("Unable to instantiate class '"+authorizerClasspath+"': "+e.getMessage(), e); }
		catch(IllegalAccessException e) { throw new SecurityFactoryException("Unable to instantiate class '"+authorizerClasspath+"': "+e.getMessage(), e); }
		catch(Throwable e) { throw new SecurityFactoryException("Unknown error in SecurityFactory: "+e.getMessage(),e); }
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
		    	Class authenticatorClass = ClassUtil.loadClass( authenticatorClasspath );
			    return (IAuthenticator)authenticatorClass.newInstance();
		}
		catch(ClassNotFoundException e) { throw new SecurityFactoryException("Unable to find class '"+authenticatorClasspath+"': "+e.getMessage(), e); }
		catch(InstantiationException e) { throw new SecurityFactoryException("Unable to instantiate class '"+authenticatorClasspath+"': "+e.getMessage(), e); }
		catch(IllegalAccessException e) { throw new SecurityFactoryException("Unable to instantiate class '"+authenticatorClasspath+"': "+e.getMessage(), e); }
		catch(Throwable e) { throw new SecurityFactoryException("Unknown error in SecurityFactory: "+e.getMessage(),e); }
	}
	
	private SecretServer createSecretServer(ByteStreamEncoder encoder) throws BusinessException, SystemException {
        int expiryInterval = Integer.parseInt(m_properties.getProperty(SECURITY_SECRET_INTERVAL));
        int expiryIntervalType  = Integer.parseInt(m_properties.getProperty(SECURITY_SECRET_INTERVAL_TYPE));
        String datasourceId = m_properties.getProperty(SECURITY_DATASOURCE_ID);
		//SecretGenerationStrategy generator = new StandardSecretGenerationStrategy(encoder, Integer.parseInt(m_properties.getProperty(SECURITY_SECRET_INTERVAL)), Integer.parseInt(m_properties.getProperty(SECURITY_SECRET_INTERVAL_TYPE)));
		//GetNextSecretCommand getNextSecretCommand = new GetNextSecretCommand(generator, m_properties.getProperty(SECURITY_DATASOURCE_ID));
		SecretManager secretServer = new SecretManager(datasourceId, expiryInterval, expiryIntervalType);
		//getNextSecretCommand.setObserver(secretServer);
		
		return secretServer;
	}
	
	public UserProfile createUserProfile() throws SystemException {
			
		RolesBuilder builder = null;
		
		builder = new RolesBuilder();
		builder.buildRoles(m_properties.getProperty(SECURITY_ROLES_XML));
		
		UserDirectoryDAO userDAO = createUserDirectoryDAO();
			
		return new DBUserProfile(builder.getRoles(), m_properties.getProperty(SECURITY_DATASOURCE_ID), userDAO);
	}
			
	public String getDatasourceId() {
		return m_properties.getProperty(SECURITY_DATASOURCE_ID);
	}
	
	/**
	 * Creates a UserDirectoryDAO object to retrieve user personal details from a directory server
	 * 
	 * @return UserDirectoryDAO object configured with basic connection properties
	 * @throws SystemException
	 */
	private UserDirectoryDAO createUserDirectoryDAO() throws SystemException {
		UserDirectoryDAO userDAO = null;
		String className = m_properties.getProperty(SECURITY_LDAP_DAO_CLASS);
				
		try {
			Class userDAOClass = ClassUtil.loadClass(className);
			if(userDAOClass == null) {
				throw new SystemException("Could not find class definition for UserDirectoryDAO implementation: " + className);
			}
			userDAO = (UserDirectoryDAO) userDAOClass.newInstance();

			// set LDAP connection properties
			InputStream propertiesStream = Util.getInputStream(m_properties.getProperty(SECURITY_LDAP_CONNECTION_PROPERTIES), this);
			Properties env = new Properties();
			
			try {	
				env.load(propertiesStream);
			}
			catch (IOException e){
				throw new SecurityFactoryException("Unable to load active directory properties file '" + 
						m_properties.getProperty(SECURITY_LDAP_CONNECTION_PROPERTIES)+"': "+e.getMessage(), e);
			}
			
			userDAO.setEnvironment(env);
		} catch (ClassNotFoundException e) {
			throw new SystemException("Could not find class definition for UserDirectoryDAO implementation: " + className, e);
		} 
		catch (InstantiationException e) {
			throw new SystemException("Could not instantiate UserDirectoryDAO implementation: " + className, e);
		} 
		catch (IllegalAccessException e) {
			throw new SystemException("Could not access UserDirectoryDAO implementation: " + className, e);
		}
		
		return userDAO;
	}
	
	/**
	 * Returns a DAO for getting the printers list from AD.
	 * 
	 * @return
	 * @throws SystemException
	 */
	public PrinterDetailsDAO createPrinterDetailsDAO() throws SystemException 
	{
		PrinterDetailsDAO printerDAO = null;
		String className = m_properties.getProperty(PRINTERS_DAO_CLASS);
		
		try {
			Class printerDAOClass = ClassUtil.loadClass(className);
			if(printerDAOClass == null) {
				throw new SystemException("Could not find class definition for PrinterDetailsDAO implementation: " + className);
			}
			printerDAO = (PrinterDetailsDAO) printerDAOClass.newInstance();

			if ( printerDAO == null ) {
				throw new SystemException("Failed to instantiate '"+className+"'");
			}
			
			// set LDAP connection properties
			InputStream propertiesStream = Util.getInputStream(m_properties.getProperty(PRINTERS_LDAP_CONNECTION_PROPERTIES), this);
			Properties env = new Properties();
			
			try {	
				env.load(propertiesStream);
			}
			catch (IOException e){
				throw new SecurityFactoryException("Unable to load active directory properties file '" + 
						m_properties.getProperty(PRINTERS_LDAP_CONNECTION_PROPERTIES)+"': "+e.getMessage(), e);
			}
			
			printerDAO.setEnvironment(env);
		} catch (ClassNotFoundException e) {
			throw new SystemException("Could not find class definition for PrinterDetailsDAO implementation: " + className, e);
		} 
		catch (InstantiationException e) {
			throw new SystemException("Could not instantiate PrinterDetailsDAO implementation: " + className, e);
		} 
		catch (IllegalAccessException e) {
			throw new SystemException("Could not access PrinterDetailsDAO implementation: " + className, e);
		}
		
		return printerDAO;
	}	
	
	public boolean getSecurityActiveFlag() {
		String securityActive = (String)m_properties.get(SECURITY_ACTIVE);
		if(securityActive != null && securityActive.equalsIgnoreCase("true"))
		return true;
		
		return false;
	}
	
}
