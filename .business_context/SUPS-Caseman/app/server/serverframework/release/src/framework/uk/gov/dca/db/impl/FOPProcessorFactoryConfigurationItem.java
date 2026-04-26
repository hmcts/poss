/*
 * Created on 10-May-2005
 *
 */
package uk.gov.dca.db.impl;

import org.jdom.Element;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.xslfo.fop.FOPProcessorFactory;

/**
 * @author Michael Barker
 *
 */
public class FOPProcessorFactoryConfigurationItem extends
        AbstractConfigurationItem
{
    FOPProcessorFactory factory;

    /* (non-Javadoc)
     * @see uk.gov.dca.db.impl.IConfigurationItem#initialise(org.jdom.Element)
     */
    public void initialise(Element eConfig) throws SystemException
    {
        factory = new FOPProcessorFactory();
    }

    /* (non-Javadoc)
     * @see uk.gov.dca.db.impl.IConfigurationItem#get()
     */
    public Object get() throws SystemException
    {
        return factory;
    }

}
