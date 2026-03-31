package uk.gov.dca.db.pipeline;

import org.jdom.Element;

import java.sql.Connection;
import java.util.Map;
import uk.gov.dca.db.exception.*;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
/*
 * Created on 26-Aug-2004
 *
 */

/**
 * Interface definition for a 'pull' pipeline component
 *
 * @author Grant Miller
 */
public interface IComponent {

	/**
	 * Sets the name used to refer to this instance of the class (as used in the XML method files).
	 * @param name
	 */
	public void setName(String name);
	
	/**
	 * Returns the name used to refer to this instance of the class.
	 * @return
	 */
	public String getName();
	
	/**
	 * Sets the context. See 'IComponentContext' for more details.
	 * This is a seperate method rather than an additional parameter on other methods
	 * in order to help maintain backward compatability (i.e. minimise interface changes) 
	 * @param context
	 */
	public void setContext(IComponentContext context);
	
	/**
	 * The component validates the processing instructions, outputting any errors to the supplied
	 * error handler.
	 * Validation is done here rather than in an external object in order to retain encapsulation
	 * of the component.
	 * 
	 * @param methodId
	 * @param handler
	 * @param processingInstructions
	 * @param preloadCache
	 * @throws BusinessException
	 * @throws SystemException
	 */
	public void validate( String methodId, QueryEngineErrorHandler handler, Element processingInstructions, Map preloadCache) 
		throws SystemException;
	
	/**
	 * Populates the container's preload cache with objects which the component would like
	 * to be preloaded upon application startup. The cached objects can also be shared between components,
	 * provided they use the same key to access the cache.
	 * This method should not alter the state of the component itself because the container does not
	 * guarantee that this instance of the class will be reused to process requests, it may just be used
	 * to populate the container's preload cache.
	 * 
	 * @param processingInstructions
	 * @param preloadCache
	 * @throws BusinessException
	 * @throws SystemException
	 */
	public void preloadCache( Element processingInstructions, Map preloadCache ) throws SystemException;
	
	/**
	 * Called to provide information about how the component should process the
	 * input. Could be called many times over the life time of the object.  
	 * 
	 * @param processingInstructions - component instance information from a method XML file.
	 * @throws BusinessException
	 * @throws SystemException
	 */
	public void prepare( Element processingInstructions, Map preloadCache ) throws SystemException;
	
	/**
	 * Sets up the pipelined chain of components.
	 * 
	 * @param parent
	 * @throws BusinessException
	 * @throws SystemException
	 */
	public void setParent( IComponent parent ) throws SystemException;
	
	/**
	 * Runs the pipeline on the specified input. This will be forwarded to any
	 * previous components in the pipeline.
	 * 
	 * @param in
	 * @param out
	 * @throws BusinessException
	 * @throws SystemException
	 */
	public void process( ComponentInput in, ComponentInput out ) throws BusinessException, SystemException;

	/**
	 * Sets the destination for this component's output.
	 * 
	 * @param sink
	 * @throws BusinessException
	 * @throws SystemException
	 */
	public void setSink( ComponentInput sink ) throws SystemException;
    
    /**
     * Populates the application context for a given connection.
     * 
     * @param dbConnection
     * @throws SystemException
     * @throws BusinessException
     */
    public void populateApplicationContext(Connection dbConnection) throws SystemException, BusinessException; 


}
