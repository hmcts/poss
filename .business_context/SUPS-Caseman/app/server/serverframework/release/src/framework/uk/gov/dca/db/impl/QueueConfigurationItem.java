/*
 * Created on 19-Apr-2005
 *
 */
package uk.gov.dca.db.impl;

import org.jdom.Element;

import uk.gov.dca.db.async.QueueHandler;
import uk.gov.dca.db.exception.SystemException;

/**
 * @author Michael Barker
 *
 */
public class QueueConfigurationItem extends AbstractConfigurationItem
{
    QueueHandler handler;

    /**
     * @see uk.gov.dca.db.impl.IConfigurationItem#initialise(org.jdom.Element)
     */
    public void initialise(Element eConfig) throws SystemException
    {
       	String factory = getValue(eConfig, "factory");
        String jndiName = getValue(eConfig, "jndi-name");
        int minPoolSize = Integer.parseInt(getValue(eConfig, "min-pool-size"));
        int maxPoolSize = Integer.parseInt(getValue(eConfig, "max-pool-size"));
        handler = new QueueHandler(eConfig.getAttributeValue("id"), factory, jndiName, minPoolSize, maxPoolSize);
    }

    /**
     * @see uk.gov.dca.db.impl.IConfigurationItem#get()
     */
    public Object get() throws SystemException
    {
        return handler;
    }

}
