/*
 * Created on 03-Sep-2004
 *
 */
package uk.gov.dca.db.impl;

import org.jdom.Element;
import uk.gov.dca.db.exception.SystemException;

/**
 * Configuration items can be used to initialise pipeline components when the
 * component is created. Each item must evaluate to an Object. 
 *
 * @author Grant Miller
 */
public interface IConfigurationItem {

	/**
	 * Prepares the item for creating the associated object.
	 * 
	 * @param eConfig - provides information needed to create the object.
	 */
	public void initialise( Element eConfig ) throws SystemException;
	
	/**
	 * Returns the object encapsulated by this configuration item.
	 * The object could be cached over multiple 'get' calls or created
	 * freshly every time.
	 * 
	 * @return
	 */
	public Object get() throws SystemException;
}
