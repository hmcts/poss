package uk.gov.dca.db;

import java.util.Map;
import org.jdom.Document;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;

/**
 * Defines the basic service interface to access the database templates.
 * 
 * @author Howard Henson
 */
public interface XMLService {

	/**
     * Inspects the configuration of the service and reports any errors
     * to the passed error handler.
     * 
     * @param handler
     */
    public void validate(QueryEngineErrorHandler handler)
    	throws SystemException;
    
    /**
     * Specifies that there is an initialisation lifecycle event which makes
     * the service ready for use.
     * The intention is that the constructor is passed the necessary parameters to
     * create the service but that they are not used until initialise.
     * This is so that validation can be run on the config passed in at creation time
     * before that config is used to make the service usable.
     */
	public void initialise()
		throws SystemException;
	
    /**
     * Executes a template given the service and method name. The document
     * generated is streamed to the write defined by the output parameter. This
     * could allow the document to be piped to other transformation code. The
     * parameters should be passed as an XML encoded string.
     * 
     * @param methodName
     *            The name of the service method to execute for example
     *            'getCase'
     * @param input
     *            Holds the input for the service call.
     * @param output
     *            Holds the output for the service call.
     * @exception BusinessException
     *                thrown when the template engine is required to throw an
     *                exception related to the input data
     * @exception SystemException
     *                thrown when the template engine is required to throw an
     *                exception related to the server itself
     */
    public void executeTemplate(String methodName, ComponentInput input, ComponentInput output) 
    	throws BusinessException, SystemException;
    
    /**
     * Retrieves the application registry used to store varous information required by the services of the application.
     * 
     * @return Map representing the application registry
     */
    public Map getApplicationRegistry();
    
    public Document applyFilter(String userId, String message) throws BusinessException, SystemException;
}