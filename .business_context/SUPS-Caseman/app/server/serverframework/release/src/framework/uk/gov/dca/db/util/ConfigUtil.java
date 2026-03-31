/*
 * Created on 05-Jan-2005
 *
 */
package uk.gov.dca.db.util;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;
import org.xml.sax.InputSource;

import uk.gov.dca.db.cache.ApplicationCache;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.IConfigurationItem;
import uk.gov.dca.db.impl.Util;

/**
 * Utility class to manage configurations.
 * 
 * @author Michael Barker
 *
 */
public class ConfigUtil {
	private static final String APPLICATION_SERVICEPREFIX = "application:serviceprefix";

	private static final String APPLICATION_WEBPREFIX = "application:webprefix";

	private static final String ATTRIBUTE_ID = "id";

	private static final String ATTRIBUTE_CLASS = "class";

	private static final String APPLICATION_NAME_CONFIG_ID = "application:name";

	public static final String APPLICATION_DEPLOYEDNAME_CONFIG_ID = "application:deployedname";

	private static final String PROJECT_CONFIG_LOOKUP_ITEM = "/project-config/lookup-items/item";

    public static final String APPLICATION_CONFIG_CONFIG_KEY = "config:" + FrameworkConfigParam.PROJECT_CONFIG.getValue();
    
	private static final Log log = SUPSLogFactory.getLogger(ConfigUtil.class);
    
	private final Map config;

	public ConfigUtil(String configFile) throws SystemException, JDOMException,
			IOException, ClassNotFoundException, InstantiationException,
			IllegalAccessException {
		this.config = createConfig(configFile);
	}

	public ConfigUtil() throws SystemException, JDOMException, IOException,
			ClassNotFoundException, InstantiationException,
			IllegalAccessException {
		this(FrameworkConfigParam.PROJECT_CONFIG.getValue());
	}

	private Map createConfig(String configFile) throws SystemException,
			JDOMException, IOException, ClassNotFoundException,
			InstantiationException, IllegalAccessException {
		InputSource in = Util.getInputSource(configFile, this);
		SAXBuilder b = new SAXBuilder();
		Document d = b.build(in);
		List elements = XPath.selectNodes(d.getRootElement(),
				PROJECT_CONFIG_LOOKUP_ITEM);

		Map config = new HashMap();
		for (Iterator i = elements.iterator(); i.hasNext();) {
			Element e = (Element) i.next();
			String className = e.getAttributeValue(ATTRIBUTE_CLASS);
			String id = e.getAttributeValue(ATTRIBUTE_ID);
			Class clazz = ClassUtil.loadClass(className);
			IConfigurationItem ci = (IConfigurationItem) clazz.newInstance();
			ci.initialise(e);
			config.put(id, ci);
		}
		return Collections.unmodifiableMap(config);
	}

	/**
	 * Return the config map containing all the config items indexed by id
	 * @return
	 */
	public Map getConfig() {
		return config;
	}

	public Object get(String id) throws SystemException {
		IConfigurationItem ci = (IConfigurationItem) config.get(id);
		if (ci == null) {
			if (log.isInfoEnabled()) {
				log.info("Unable to load config item with id: " + id);
			}
			throw new SystemException("Unable to load config item with id: "
					+ id);
		}
		return ci.get();
	}

    /**
     * Loads the Configuration into ConfigUtil.  Will load it from the cache if
     * possible.  If not found in the cache, it will be constucted from new.
     * 
     * @param configFile
     * @return
     * @throws SystemException If any problem occurs.
     */
	public static ConfigUtil create(String configFile) throws SystemException {
        
		try {
            
            String key = "config:" + configFile;
            ApplicationCache appCache = ApplicationCache.getInstance();
            ConfigUtil cfg = (ConfigUtil) appCache.get(key);
            if (cfg == null)
            {
                cfg = new ConfigUtil(configFile);
                appCache.put(key, cfg);
                log.debug("Cache Miss");
            }
            else
            {
                log.debug("Cache Hit");               
            }
            return cfg;
            
		}
        catch (JDOMException e) {
			throw new SystemException("Unable to load configuration", e);
		} 
        catch (IOException e) {
			throw new SystemException("Unable to load configuration", e);
		}
        catch (ClassNotFoundException e) {
			throw new SystemException("Unable to load configuration", e);
		}
        catch (InstantiationException e) {
			throw new SystemException("Unable to load configuration", e);
		}
        catch (IllegalAccessException e) {
			throw new SystemException("Unable to load configuration", e);
		}
	}

	/**
	 *
	 * @return The path to the project_config.xml file stored in the conf.jar used to generate the service beans
	 */
	public String getProjectConfigPath(){
		return FrameworkConfigParam.PROJECT_CONFIG.getValue();		
	}
	
	/**
	 * @return The name the Project is known as "java package structure" and not the name the servlets are used as
	 */
	public String getApplictionPackageName(){
		return FrameworkConfigParam.APPLICATION_NAME.getValue();		
	}
	
	/**
	 * 
	 * get the name as in the uk.gov.dca.xyz.common
	 * 
	 * @return
	 */
	public String getApplicationName(){
		String applicationName = getApplictionPackageName();
		try{
			applicationName = (String)((IConfigurationItem)config.get(APPLICATION_NAME_CONFIG_ID)).get();
		}
		catch(SystemException e){
			log.error("Unable to load ConfigurationItem; " + APPLICATION_NAME_CONFIG_ID,e);			
		}
		return applicationName;
	}
	
	/**
	 * get the name the application is deployed as xyzit01 xyzpt01 xyzit01
	 * 
	 * @return
	 */
	public String getApplicationDeployedName(){
		String applicationDeployedName = getApplictionPackageName();
		try{
			applicationDeployedName = (String)((IConfigurationItem)config.get(APPLICATION_DEPLOYEDNAME_CONFIG_ID)).get();
		}
		catch(SystemException e){			
			log.error("Unable to load ConfigurationItem; " + APPLICATION_DEPLOYEDNAME_CONFIG_ID,e);			
		}
		return applicationDeployedName;
	}
	
	public String getApplicationServicePrefix(){
		String applicationDeployedName = getApplictionPackageName();
		try{
			applicationDeployedName = (String)((IConfigurationItem)config.get(APPLICATION_SERVICEPREFIX)).get();
		}
		catch(SystemException e){			
			log.error("Unable to load ConfigurationItem; " + APPLICATION_SERVICEPREFIX,e);			
		}
		return applicationDeployedName;
	}
	
	public String getApplicationWebPrefix(){
		String applicationDeployedName = getApplictionPackageName();
		try{
			applicationDeployedName = (String)((IConfigurationItem)config.get(APPLICATION_WEBPREFIX)).get();
		}
		catch(SystemException e){			
			log.error("Unable to load ConfigurationItem; " + APPLICATION_WEBPREFIX,e);			
		}
		return applicationDeployedName;
	}
    
    /**
     * Gets a connection using the connection name specified in the project config
     * file.
     * 
     * @param projectConfig Name of the project configuration as a resource
     * @param dsName The name of the datasource in the configuration file.
     * @return
     * @throws SystemException
     * @throws SQLException
     */
    public static Connection getConnection(String projectConfig, String dsName) throws SystemException, SQLException
    {
        ConfigUtil cu = ConfigUtil.create(projectConfig);
        DataSource ds = (DataSource) cu.get(dsName);
        return ds.getConnection();
    }
	
}
