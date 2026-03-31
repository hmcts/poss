/*
 * Created on 04-Aug-2005
 *
 */
package uk.gov.dca.db.impl;

import org.apache.commons.logging.Log;
import org.jdom.Element;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Implementation of a configuration item to fetch variables from 
 * the system properties with an associated default.
 * 
 */
public class PropertyConfigurationItem implements IConfigurationItem {

    private String propertyName = null;
    private String defaultValue = null;
    private final Log log = SUPSLogFactory.getLogger(PropertyConfigurationItem.class);
    
    public void initialise(Element eConfig) throws SystemException {
        
        propertyName = eConfig.getAttributeValue("id");
        defaultValue = eConfig.getText();
    }

    public Object get() throws SystemException {
        
        if (propertyName == null) {
            log.warn("Property Name is null");
            return "";
        }
        else {
            return System.getProperty(propertyName, defaultValue);            
        }
        
    }

}
