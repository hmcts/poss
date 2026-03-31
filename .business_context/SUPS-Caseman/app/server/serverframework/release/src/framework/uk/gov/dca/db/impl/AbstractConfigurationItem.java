/*
 * Created on 19-Apr-2005
 *
 */
package uk.gov.dca.db.impl;

import org.jdom.Element;

/**
 * @author Michael Barker
 *
 */
public abstract class AbstractConfigurationItem implements IConfigurationItem
{

   

    
    protected String getValue(Element eConfig, String childname)
    {
        String text = eConfig.getChildText(childname);
        if (text != null)
        {
            return text;
        }
        else
        {
            throw new RuntimeException("The field '" + childname + "' has not been specified");
        }
    }
 
 

}
