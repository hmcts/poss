/*
 * Created on 03-Sep-2004
 *
 */
package uk.gov.dca.db.impl;

import org.jdom.Element;
import javax.naming.InitialContext;
import javax.naming.NamingException;

/**
 * A configuration item which returns an object from the encapsulated JNDI InitialContext.
 *
 * @author Grant Miller
 */
public class JNDIConfigurationItem implements IConfigurationItem {

	private String m_sJndiKey = null;
	private Object m_dataSource = null;
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.impl.IContextItem#Initialise(org.jdom.Element)
	 */
	public void initialise(Element eConfig) {
		// only config we need to get is the jndi key
		if ( eConfig != null ) {
			m_sJndiKey = (String)eConfig.getValue();
		}
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.impl.IContextItem#get(java.lang.String)
	 */
	public Object get() throws ConfigurationItemException
	{	
		if ( m_dataSource == null) {
			try {
				InitialContext ic = new InitialContext();
				m_dataSource = ic.lookup(m_sJndiKey);
			}
			catch (NamingException e) {
				throw new ConfigurationItemException("Failed to retrieve jndi context item:"+ m_sJndiKey,e);
			}
		}
		
	    return m_dataSource;
	}

}
