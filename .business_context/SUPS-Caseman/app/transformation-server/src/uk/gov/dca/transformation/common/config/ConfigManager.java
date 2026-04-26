/*
 * Created on 06-Jul-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.transformation.common.config;

import java.util.Hashtable;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.gov.dca.transformation.common.web_delegator.IWebServiceObject;
import uk.gov.dca.transformation.common.config.ConfigXmlProcessor;
import uk.gov.dca.db.exception.SystemException;

/**
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class ConfigManager {
    private static final Log log = LogFactory.getLog(ConfigManager.class);
    private static final ConfigManager instance = new ConfigManager();
    protected Map webConfig;
    protected Hashtable jndiConfig;
    
    private ConfigManager(){      
        load();
    }
    
    public static ConfigManager getInstance() {     
        return instance;
    }
    
    public IWebServiceObject getWebServiceObject(String key) {
        if(webConfig.containsKey(key)) {
            return (IWebServiceObject) webConfig.get(key);
        } else {
            return null;
        }
    }
    
    public Hashtable getJndiHash() {
        return jndiConfig;
    }
    
    private void load(){
        try {
            System.out.println("In Load");
            ConfigXmlProcessor config = new ConfigXmlProcessor();
            webConfig = config.getWebServiceObjects();
            jndiConfig = config.getJndiMap();
        } catch(SystemException se) {
            log.error("Unable to Load Data", se);
        }
    }
    
}
