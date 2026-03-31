/*
 * Created on 13-May-2005
 *
 */
package uk.gov.dca.db.impl;

import javax.sql.DataSource;

import org.jdom.Element;

import uk.gov.dca.db.content.DocumentManager;
import uk.gov.dca.db.ejb.ServiceLocator;
import uk.gov.dca.db.exception.SystemException;

/**
 * @author Michael Barker
 *
 */
public class DocumentManagerConfigurationItem extends AbstractConfigurationItem
{
    DocumentManager docManager;
    
    /**
     * @see uk.gov.dca.db.impl.IConfigurationItem#initialise(org.jdom.Element)
     */
    public void initialise(Element eConfig) throws SystemException
    {
    	String isLocalDS = eConfig.getAttributeValue("local");
    	if ( isLocalDS != null && "true".compareToIgnoreCase(isLocalDS) == 0 ) {
    		IConfigurationItem jdbcItem = new JDBCConfigurationItem();
    		jdbcItem.initialise(eConfig);
    		
    		DataSource ds = (DataSource) jdbcItem.get();
    		docManager = new DocumentManager(ds);
    	}
    	else {
    		try
    	    {
	            String dsName = getValue(eConfig, "datasource");
	            DataSource ds = (DataSource) ServiceLocator.getInstance().get(dsName);
	            
	            docManager = new DocumentManager(ds);
	        }
	        catch (Exception e)
	        {
	            throw new SystemException(e);
	        }
    	}
    }

    /**
     * @see uk.gov.dca.db.impl.IConfigurationItem#get()
     */
    public Object get() throws SystemException
    {
        return docManager;
    }

}
