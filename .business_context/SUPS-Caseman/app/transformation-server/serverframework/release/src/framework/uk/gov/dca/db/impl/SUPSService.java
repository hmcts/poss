package uk.gov.dca.db.impl;

import java.io.IOException;
import java.io.Writer;
import java.io.StringWriter;
import java.util.TreeMap;
import java.util.Map;
import java.util.List;
import java.util.Iterator;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.Attribute;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.xml.sax.InputSource;
import uk.gov.dca.db.XMLService;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.ejb.filter.Filter;
import uk.gov.dca.db.pipeline.IComponent;
import uk.gov.dca.db.pipeline.ComponentContext;
import uk.gov.dca.db.pipeline.ComponentFactory;
import org.jdom.xpath.XPath;
import uk.gov.dca.db.exception.*;

/**
 * Implements the XMLService interface.
 * 
 * @author Howard Henson
 */
public class SUPSService implements XMLService {

    private static final Log log = LogFactory.getLog(SUPSService.class);
    
    // constants for system component context items
    public static final String CONTEXT_SERVICE_NAME_KEY = "service_name";
    public static final String CONTEXT_METHOD_NAME_KEY = "method_name";
    public static final String CONTEXT_REQUEST_PARAMETERS_KEY = "request_parameters";
    
    // variables needed for construction:
    private String[] m_methods = null;
    private String m_sFrameworkConfig = null;
	private String m_sProjectConfig = null;
	private String m_serviceName = null;
	
    // Used to intitialise and create component based pipelines:
	private ComponentFactory m_serviceFactory = null;
    
    // A method name to template file:
    private Map m_service = new TreeMap();
    
    // A map of preloaded cached objects:
    private Map m_preloadCache = new TreeMap();

    // A reusable SAXBuilder:
    protected SAXBuilder m_saxBuilder = new SAXBuilder();

    public SUPSService(String templatePath)
	{
        super();
    }
    
    /**
     * There is a 2 stage initialisation process. There are 2 use cases:
     * 1) Instantiate then initialise service for use
     * 2) Instantiate then validate (and then optionally initialise) 
     * 
     * Note: the constructor must do nothing which could be considered as validation.
     */
    public SUPSService(String serviceName, String[] methods, String sFrameworkConfig, String sProjectConfig)
    {
    	m_serviceName = serviceName;
    	m_methods = methods;
    	m_sFrameworkConfig = sFrameworkConfig;
    	m_sProjectConfig = sProjectConfig;
    }
    
    /**
     * Called to initialise the service for active use.
     * 
     * @throws SystemException
     */
    public void initialise() throws SystemException
    { 
        // Populate the preload cache with the lookup items defined in the
        // project configuration file (typically the available datasources).
        // The preload cache is a store of preloaded, sharable and reusable objects.
    	log.debug("Initialising SUPSService: project cfg="+m_sProjectConfig+" framework cfg="+m_sFrameworkConfig);
        InputSource isProjCfg = Util.getInputSource(m_sProjectConfig, this);
        log.debug("Found project cfg file");
        
        SAXBuilder builder = new SAXBuilder();
        Document doc = null;
        try {
        	doc = builder.build(isProjCfg);
        }
        catch(IOException e) {
        	throw new SystemException("Failed to load file '"+m_sProjectConfig+"': "+e.getMessage(), e);
        }
        catch(JDOMException e) {
        	throw new ConfigurationException("Failed to process file '"+m_sProjectConfig+"': "+e.getMessage(), e);
        }
        
        Element root = doc.getRootElement();
        List lLookupItems = null;
        try {
        	lLookupItems = XPath.selectNodes( root, "/project-config/lookup-items/item");
        }
        catch(JDOMException e) {
        	throw new SystemException("Failed to retrieve lookup items from project configuration file '"+m_sProjectConfig+"': "+e.getMessage(), e);
        }
        
        Iterator itLookups = lLookupItems.iterator();
        while (itLookups.hasNext()) {
        	cacheLookupItem( m_preloadCache, (Element)itLookups.next() );
        }
        
        // register the method templates. Includes preparing preload cache for each method.
        InputSource isFrameworkCfg = Util.getInputSource(m_sFrameworkConfig, this);
        log.debug("Found framework cfg file");
        
    	m_serviceFactory = new ComponentFactory(isFrameworkCfg);
    	  	
	    // now register
	    String sMethodId = null;
        for (int i = 0; i < m_methods.length; i++)
        {
        	registerTemplate(m_methods[i]);
        }
    }
        
    /**
     * Validates the service. Errors are reported using the passed error handler.
     * It leaves the service in the same state as it was before it was validated.
     * In order to use the service a call to 'initialise' is required.
     */
    public void validate(QueryEngineErrorHandler handler) throws SystemException
    {
     	if ( handler == null )
    		throw new SystemException("Cannot validate service because a 'null' error handler has been provided");
    	if ( m_sFrameworkConfig == null || m_sFrameworkConfig.length() == 0)
    		throw new ConfigurationException("Cannot validate service because framework config is unspecified");
    	if ( m_sProjectConfig == null || m_sProjectConfig.length() == 0)
    		throw new ConfigurationException("Cannot validate service because project config is unspecified");
    	
    	ComponentFactory serviceFactory = null;
    	
		// for validation purposes we only preload the project config lookup items.
		// this is so that individual components can verify that the item they will want to
		// get from the map will infact be there.
		// Also, in order to validate the db tables + fields referenced against the actual
		// db metadata the db will need to be accessed at validation time. Therefore the
		// connection will have to be available from the preload map.
		Map preloadMap = new TreeMap();
		
    	// validate the framework config. This is simply whether or not it exists -
        // because a user of the framework should have been provided with a valid copy.
	    InputSource isFrameworkCfg = Util.getInputSource(m_sFrameworkConfig, this);
	    serviceFactory = new ComponentFactory(isFrameworkCfg);
	    	
	    // validate whether the project config file exists.
	    InputSource isProjectCfg = Util.getInputSource(m_sProjectConfig, this);
	    validateProjectConfig(handler, isProjectCfg, preloadMap);
	    
	    // create a context which can be passed to the components
	    ComponentContext context = new ComponentContext();
	    context.putSystemItem(CONTEXT_SERVICE_NAME_KEY, m_serviceName);
	    
    	// validate the methods
    	for( int i = 0; i < m_methods.length; i++ )
    	{
    		String methodId = m_methods[i];
    		InputSource methodSrc = null;
    		
	    	handler.raiseMessage("Validating method: " + methodId);
	    	
	    	methodSrc = Util.getInputSource(methodId, this);
    		
    		if ( methodSrc != null)
    		{
	    		SAXBuilder saxBuilder = new SAXBuilder();
	    		Document document = null;
	    		try {
	    			document = saxBuilder.build(methodSrc);
	    		} 
	        	catch (IOException e){
	            	throw new SystemException("Failed to load XML template '"+methodId+"': "+e.getMessage(), e);
	        	}
	        	catch (JDOMException e) {
	            	throw new ConfigurationException("Failed to process XML template '"+methodId+"': "+e.getMessage(), e);
	        	}
	    	    	
	        	Element methodXML = document.getRootElement();
	        	
	        	context.putSystemItem(CONTEXT_METHOD_NAME_KEY, getMethodName(methodId) );
	        	serviceFactory.validate(methodId, context, handler, methodXML, preloadMap);
    		}
		}
    }
    
    /**
     * Validates that the project config file is of the correct form and also preloads the passed
     * map with the lookup items specified. These may be needed by other components in order to 
     * validate themselves.
     * Note: the validation approach is to try and validate as much as possible. Therefore we do not stop
     * validation when the first problem is encountered.
     * 
     * @param config
     * @param preloadMap
     */
    private void validateProjectConfig(QueryEngineErrorHandler handler, InputSource configSrc, Map preloadMap)
    	throws SystemException
	{
    	if ( configSrc == null || preloadMap == null ) {
    		throw new SystemException("Invalid validateProjectConfig parameters: configSrc="+configSrc+" preloadMap="+preloadMap);
    	}
    	
    	SAXBuilder saxBuilder = new SAXBuilder();
		Document document = null;
		try {
			document = saxBuilder.build(configSrc);
		}
		catch(IOException e) {
			throw new SystemException("Unable to load project configuration file: "+e.getMessage(),e);
		}
		catch(JDOMException e) {
			throw new ConfigurationException("Unable to process project configuration file: "+e.getMessage(),e);
		}
		
    	Element configXML = document.getRootElement();
		if ( "project-config".compareTo(configXML.getName()) != 0 ) {
			handler.raiseError("Project configuration file does not have root node 'project-config'");
		}
		Element eLookupItems = configXML.getChild("lookup-items");
		if (eLookupItems == null)
			handler.raiseError("Project configuration file does not have node 'project-config/lookup-items'");
		else {
			// validate/create lookup items
			List lLookupItems = null;
			try {
				lLookupItems = XPath.selectNodes( configXML, "/project-config/lookup-items/item");
			}
			catch(JDOMException e) {
				throw new SystemException("Unable to evaluate elements '/project-config/lookup-items/item': "+e.getMessage(),e);
			}
			
	        Iterator itLookups = lLookupItems.iterator();
	        while (itLookups.hasNext()) {
	        	String sId = null;
        		String sClass = null;
        		
        		Element eItem = (Element)itLookups.next();
        		// validate attributes
        		Attribute attrId = (Attribute)eItem.getAttribute("id");
        		if ( attrId == null )
        			handler.raiseError("Project configuration lookup item has no 'id' attribute");
        		else
        			sId = attrId.getValue();
        		
        		Attribute attrClass = (Attribute)eItem.getAttribute("class");
        		if ( attrClass == null )
        			handler.raiseError("Project configuration lookup item has no 'class' attribute");
        		else
        			sClass = attrClass.getValue();

        		// now create and cache the item
        		cacheLookupItem( preloadMap, eItem );
	        }
		}
	}
    
    /**
     * Initialises the service for the specified method.
     * 
     * @param context
     * @param templateName
     * @throws JDOMException
     * @throws IOException
     * @throws SystemException
     */
    private void registerTemplate(String templateName) throws SystemException
	{
        // add the method to the service mapping:
    	String methodName = getMethodName( templateName );
        addMethodTemplate(methodName, templateName);
        
        // create a context which can be passed to the components
	    ComponentContext context = new ComponentContext();
	    context.putSystemItem(CONTEXT_SERVICE_NAME_KEY, m_serviceName);
        context.putSystemItem(CONTEXT_METHOD_NAME_KEY, methodName);
    	
        // now prepare the preload cache for the new method.
    	InputSource input = Util.getInputSource(templateName, this);
        Document document = null;
        try {
        	document = m_saxBuilder.build(input);
        }
        catch(IOException e) {
        	throw new SystemException("Failed to load method template '"+templateName+"': "+e.getMessage());
        }
        catch(JDOMException e) {
            throw new ConfigurationException("Failed to process method template '"+templateName+"': "+e.getMessage());
        }
        
        Element element = document.getRootElement();

        m_serviceFactory.preloadCache(context, element, m_preloadCache );
        
        log.info("Added template: " + methodName);
    }

    /**
     * Adds an entry to the map of method name to service name.
     * 
     * @param methodName
     * @param templateName
     */
    protected void addMethodTemplate(String methodName, String templateName) 
    	throws ConfigurationException
    {
		if (m_service.containsKey(methodName)) {
			throw new ConfigurationException("Duplicate method detected: " + methodName);
		}
		m_service.put(methodName, templateName);
    }

    /**
     * Retrieves an XML input source for the specified method name.
     * 
     * @param method
     * @return
     */
    protected InputSource getMethodTemplate(String method) 
    	throws SystemException
    {
        String templateName = (String) m_service.get(method); 
        return Util.getInputSource(templateName, this);
    }

 
    /**
     * @see uk.gov.dca.db.XMLService#executeTemplate(java.lang.String,
     *      java.lang.String, java.lang.String, java.io.Writer)
     */
    public void executeTemplate(String methodName, String parameters, Writer output) 
    	throws BusinessException, SystemException
	{
    	log.debug("Executing '"+m_serviceName+"."+methodName+"'");
    	
        InputSource template = getMethodTemplate( methodName);
        
        if (template == null ) {
            throw new SystemException("Unable to find method template '"+methodName+"' for service '"+m_serviceName+"'");
        }
    
       	SAXBuilder saxBuilder = new SAXBuilder();
    	Document document = null;
    	try {
    		document = saxBuilder.build(template);
    	}
    	catch(IOException e) {
    		throw new SystemException("Unable to load method template '"+methodName+"' for service '"+m_serviceName+"'",e);
    	}
        catch(JDOMException e) {
            throw new ConfigurationException("Unable to process method template '"+methodName+"' for service '"+m_serviceName+"'",e);
        }
    
        // create a context which can be passed to the components
	    ComponentContext context = new ComponentContext();
	    context.putSystemItem(CONTEXT_SERVICE_NAME_KEY, m_serviceName);
	    context.putSystemItem(CONTEXT_METHOD_NAME_KEY, methodName);
	    context.putSystemItem(CONTEXT_REQUEST_PARAMETERS_KEY, parameters);
	    
	    // get the pipeline
        Element root = document.getRootElement();    
        IComponent service = m_serviceFactory.getMethodPipeline(context, root, m_preloadCache);
        
        if (service == null) {
            throw new ConfigurationException("No method defined for: " + m_serviceName + "." + methodName);
        }
            
        Writer input = new StringWriter();
        try {
            input.write(parameters);
		}
    	catch(IOException e) {
    		throw new SystemException("Unable to write to input: "+e.getMessage(),e );
    	}
            
    	service.process( input, output );
    }
    
    public String applyFilter(String userId, String message) throws BusinessException, SystemException {
    	Filter serviceFilter = m_serviceFactory.getServiceFilter();
    	return serviceFilter.apply(userId, message);
    }
   
    /**
     * Helper method to add the item defined by the passed lookup item configuration  
     * to the passed cache
     * 
     * @param cacheMap
     * @param eCfg
     * @throws BusinessException
     */
    protected void cacheLookupItem(Map cacheMap, Element eCfg) throws SystemException
    {
    	if ( eCfg != null )
    	{
    		String sId = (String)eCfg.getAttributeValue("id");
    		String sClass = (String)eCfg.getAttributeValue("class");

    		if ( sClass != null ){
    			try {
    				Class itemClass = Class.forName( sClass );
    				IConfigurationItem newItem = (IConfigurationItem)itemClass.newInstance();
    				newItem.initialise(eCfg);
    				try {
    					Object oItem = newItem.get();
    					cacheMap.put( sId, oItem );
    				}
    				catch( ConfigurationItemException e ) {
    					throw new ConfigurationException("Failed to retreive configuration item: "+e.getMessage() ,e);
    				}
    			}
    			catch (ClassNotFoundException e) {
    				throw new ConfigurationException("Could not find class '"+sClass+"'" ,e);
    			}
				catch (IllegalAccessException e) {
					throw new SystemException("Failed to instantiate class '"+sClass+"': "+e.getMessage() ,e);
				}
				catch (InstantiationException e) {
					throw new SystemException("Failed to instantiate class '"+sClass+"': "+e.getMessage() ,e);
				}
    		}
    	}
    }
    
	/**
	 * Helper method to remove any underscores and convert the following letter to a capital
     * Input will be a service or method name string.
	 */
    private String getMethodName(String sMethodFilename)
    {
    	String sReturn = "";
    	
    	String sMethodWithUnderscores = 
    		sMethodFilename.substring( sMethodFilename.lastIndexOf('/')+1, sMethodFilename.lastIndexOf(".xml") );
        
    	// length must be minimum 2 chars eg. _a
    	if ( sMethodWithUnderscores != null && sMethodWithUnderscores.length() >= 2) 
    	{
    		String[] arrWords = sMethodWithUnderscores.split("_");
    		
    		sReturn = arrWords[0];
    		for ( int i = 0; i < arrWords.length-1; i++)
    		{
    			String sWord = arrWords[i+1];
    			sReturn += sWord.substring(0,1).toUpperCase() + sWord.substring(1);
    		}
    	}
    	else sReturn = sMethodWithUnderscores;
  
    	return sReturn;
    }

    /**
     * Retrieves the application registry used to store varous information required by the services of the application.
     * 
     * @return Map representing the application registry
     */
    public Map getApplicationRegistry() {
    	return m_preloadCache;
    }
}