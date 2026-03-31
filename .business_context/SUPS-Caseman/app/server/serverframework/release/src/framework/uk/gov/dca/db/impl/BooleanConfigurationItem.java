/*
 * Created on 03-Sep-2004
 *
 */
package uk.gov.dca.db.impl;

import org.jdom.Element;

/**
 * A configuration item which returns a string.
 *
 * @author Grant Miller
 */
public class BooleanConfigurationItem implements IConfigurationItem {

	private Boolean m_boolValue = null;
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.impl.IContextItem#Initialise(org.jdom.Element)
	 */
	public void initialise(Element eConfig) {
		if ( eConfig != null ) {            
			m_boolValue = new Boolean((String)eConfig.getValue());
		}
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.impl.IContextItem#get(java.lang.String)
	 */
	public Object get() throws ConfigurationItemException
	{	
	    return m_boolValue;
	}

}
