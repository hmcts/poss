/*
 * Created on 07-Jan-2005
 *
 */
package uk.gov.dca.db.pipeline;

import java.util.Map;
import java.util.TreeMap;

/**
 * Implementation of IComponentContext. Additionally allows system context items to be added.
 * 
 * @author GrantM
 *
 */
public class ComponentContext implements IComponentContext {
	
	private Map m_systemContext = new TreeMap();
	private Map m_userContext = new TreeMap();
	
	/**
	 * Default constructor
	 */
	public ComponentContext() {
		super();
	}

	/**
	 * Adds a system item to the context.
	 * @param key
	 * @param item
	 */
	public void putSystemItem(String key, Object item) {
		m_systemContext.put(key, item);
	}
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponentContext#getSystemItem(java.lang.String)
	 */
	public Object getSystemItem(String key) {
		return m_systemContext.get(key);
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponentContext#getUserItem(java.lang.String)
	 */
	public Object getUserItem(String key) {
		return m_userContext.get(key);
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponentContext#putUserItem(java.lang.String, java.lang.Object)
	 */
	public void putUserItem(String key, Object item) {
		m_userContext.put(key, item);
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponentContext#removeUserItem(java.lang.String)
	 */
	public void removeUserItem(String key) {
		m_userContext.remove(key);
	}

}
