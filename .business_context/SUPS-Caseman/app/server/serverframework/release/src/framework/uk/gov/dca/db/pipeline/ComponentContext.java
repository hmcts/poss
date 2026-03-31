/*
 * Created on 07-Jan-2005
 *
 */
package uk.gov.dca.db.pipeline;

import java.util.Map;
import java.util.TreeMap;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.component_input.ConverterFactory;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;

/**
 * Implementation of IComponentContext. Additionally allows system context items to be added.
 * 
 * @author GrantM
 *
 */
public class ComponentContext implements IComponentContext {
	
	private Map m_systemContext = new TreeMap();
	private Map m_userContext = new TreeMap();
	private ComponentContext parent = null;
	private ConverterFactory m_coverterFactory = null;
	
	/**
	 * Default constructor
	 */
	public ComponentContext() {
		super();
	}

	public ComponentContext(ComponentContext parent) {
		super();
		this.parent = parent;
	}
	
	/**
	 * Adds a system item to the context.
	 * @param key
	 * @param item
	 */
	public void putSystemItem(String key, Object item) {
		m_systemContext.put(key, item);
	}
	
	/**
	 * Will attempt to recurse up the Context stack looking for the
	 * specified system item.  Will return null if not available.
	 * 
	 * @see uk.gov.dca.db.pipeline.IComponentContext#getSystemItem(java.lang.String)
	 */
	public Object getSystemItem(String key)
	{
		Object item = m_systemContext.get(key);
		if ( item == null )
		{
			if ( IComponentContext.REQUEST_PARAMETERS_KEY.compareTo(key)==0 )
			{
				// see if the parameters have instead been set by COMPONENT_INPUT_KEY
				Object componentInput = m_systemContext.get(IComponentContext.COMPONENT_INPUT_KEY);
				if (componentInput!=null) 
				{
					try {
						item = ((ComponentInput)componentInput).getData(String.class);
					}
					catch(SystemException e) {}
					catch(BusinessException e) {}
				}
			}
			else if ( IComponentContext.COMPONENT_INPUT_KEY.compareTo(key)==0 )
			{
				// see if the parameters have instead been set by REQUEST_PARAMETERS_KEY
				Object stringInput = m_systemContext.get(IComponentContext.REQUEST_PARAMETERS_KEY);
				if ( item != null ) {
					try {
						ComponentInput componentInput = new ComponentInput(this.getInputConverterFactory());
						componentInput.setData(stringInput, String.class);
					}
					catch(SystemException e) {}
				}
			}
		}
		
		if (item == null && hasParent())
		{
		    item = getParent().getSystemItem(key);
		}
		return item;
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
	
	public ComponentContext getParent()
	{
	    return this.parent;
	}
	
	public boolean hasParent()
	{
	    return this.parent != null;
	}

	public ConverterFactory getInputConverterFactory()
	{
		return this.m_coverterFactory;
	}
	

	public void setInputConverterFactory(ConverterFactory coverterFactory)
	{
		m_coverterFactory = coverterFactory;
	}
}
