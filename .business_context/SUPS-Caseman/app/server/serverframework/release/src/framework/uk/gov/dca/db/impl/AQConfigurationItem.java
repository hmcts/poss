/*
 * Created on Jul 28, 2005
 *
 */
package uk.gov.dca.db.impl;

import org.jdom.Element;

import uk.gov.dca.db.async.QueueHandler;
import uk.gov.dca.db.exception.SystemException;

/**
 * @author GrantM
 *
 */
public class AQConfigurationItem extends AbstractConfigurationItem {

    QueueHandler handler;
    
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.impl.IConfigurationItem#initialise(org.jdom.Element)
	 */
	public void initialise(Element eConfig) throws SystemException {

       	String factory = getValue(eConfig, "factory");
        String jndiName = getValue(eConfig, "jndi-name");
        int minPoolSize = 0;
        int maxPoolSize = 0;
        handler = new QueueHandler(eConfig.getAttributeValue("id"), factory, jndiName, minPoolSize, maxPoolSize);
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.impl.IConfigurationItem#get()
	 */
	public Object get() throws SystemException {
        return handler;
	}

}
