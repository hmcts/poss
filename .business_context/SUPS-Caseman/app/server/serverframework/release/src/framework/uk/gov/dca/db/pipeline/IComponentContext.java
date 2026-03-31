/*
 * Created on 07-Jan-2005
 *
 */
package uk.gov.dca.db.pipeline;

import uk.gov.dca.db.pipeline.component_input.ConverterFactory;

/**
 * Interface for accessing the context in which a component runs.
 * The lifetime of a context instance is a single service lifecycle event.
 * These are:
 * - validation (component method 'validate')
 * - initialisation (component method 'preloadCache')
 * - request processing (component methods 'prepare' and 'process')
 * 
 * Thus, a user item added to the context in 'preloadCache' will not be available
 * from 'prepare' or 'process'. However, an item added in 'prepare' can be accessed
 * in 'process'.
 * The context is not meant to be used (and cannot) as a way of maintaining state 
 * across multiple service requests.
 * 
 * @author GrantM
 */
public interface IComponentContext {
	
	/**
	 * Returns a system item. A system item is one which has been placed in the context
	 * by the container. A component should treat these as read only.
	 * @param key
	 * @return
	 */
	public Object getSystemItem(String key);
	
	/**
	 * Returns the requested user item. User items are ones which a component can place 
	 * into and retrieve from the context. The component is allowed to modify these items.
	 * @param key
	 * @return
	 */
	public Object getUserItem(String key);
	
	/**
	 * Adds a user item to the context.
	 * @param key
	 * @param item
	 */
	public void putUserItem(String key, Object item);
	
	/**
	 * Removes a user item from the context.
	 * @param key
	 */
	public void removeUserItem(String key);
	
	/**
	 * Returns a component input ConverterFactory
	 * @return
	 */
	public ConverterFactory getInputConverterFactory();
	
	/**
	 * Initialises the component input ConverterFactory
	 * @param coverterFactory
	 */
	public void setInputConverterFactory(ConverterFactory coverterFactory);
	
	// keys for commonly used system properties
	public static final String USER_ID_KEY = "userId";
	public static final String COURT_ID_KEY = "courtId";
	public static final String BUSINESS_PROCESS_ID_KEY = "businessProcessId";
	public static final String SERVICE_NAME_KEY = "service_name";
    public static final String METHOD_NAME_KEY = "method_name";
    public static final String REQUEST_PARAMETERS_KEY = "request_parameters";
    public static final String COMPONENT_INPUT_KEY = "component_input";
}
