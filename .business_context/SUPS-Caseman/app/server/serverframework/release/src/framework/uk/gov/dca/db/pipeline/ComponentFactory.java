package uk.gov.dca.db.pipeline;

import java.io.IOException;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.Attribute;
import org.jdom.JDOMException;
import org.xml.sax.InputSource;
import java.util.Map;
import java.util.TreeMap;
import java.util.List;
import java.util.Set;
import java.util.Iterator;

import org.jdom.input.SAXBuilder;
import uk.gov.dca.db.ejb.filter.Filter;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.util.ClassUtil;
import uk.gov.dca.db.exception.*;

/**
 * This class is a single point from which to create and get information
 * about components.
 * 
 * @author Grant Miller
 *
 */
public class ComponentFactory {

	// A map of pipeline 'role' name to interface class:
	private Map m_roleMap = new TreeMap();
	
	// A map of component name to implementing class:
	private Map m_componentMap = new TreeMap();
	
	// A map of component name to initilisation configuration XML:
	private Map m_componentConfigMap = new TreeMap();
	
	// The contexts, stored as a map:
	private Map m_contexts = new TreeMap();
	
	private Filter filter = null;
	
	// some statics (currently incomplete):
	private final static String SERVICE_METHOD_ELEMENT = "service-method";
	private final static String SERVICE_METHOD_VISIBILITY_ATTRIBUTE = "visibility";
	private final static String SERVICE_METHOD_VISIBILITY_LOCAL_VALUE = "local";
	private final static String SERVICE_METHOD_VISIBILITY_BOTH_VALUE = "both";
	private final static String PIPELINE_ELEMENT = "pipeline";
	private final static String SECURITY_ELEMENT = "Security";
	private final static String SECURITY_ROLES_ATTRIBUTE = "roles";
	
	/**
	 * Initialises the factory using the SUPS service configuration XML provided.
	 * 
	 * @param isConfig
	 */
	public ComponentFactory(InputSource isConfig)
		throws SystemException
	{
		SAXBuilder saxBuilder = new SAXBuilder();
		Document configDocument = null;
		try {
			configDocument = saxBuilder.build(isConfig);
		}
		catch(IOException e) {
			throw new SystemException("Unable to load SUPS configuration: "+e.getMessage(), e);
		}
		catch(JDOMException e) {
			throw new ConfigurationException("Unable to process SUPS configuration: "+e.getMessage(), e);
		}
		
        Element root = configDocument.getRootElement();
        if ( "sups-config".compareTo( root.getName() ) == 0 ) {
        	// extract roles
        	List lRoles = root.getChild("roles").getChildren("role");
        	Iterator iRoles = lRoles.iterator();
        	while ( iRoles.hasNext() ) {
        		Element role = (Element)iRoles.next();
        		String sName = role.getAttribute("name").getValue();
        		String sInterface = role.getAttribute("implements").getValue();
        		if ( sName.length() > 0 && sInterface.length() > 0 ) {
        			m_roleMap.put(sName, sInterface);
        		}
        	}
        	// extract components
        	List lComponents = root.getChild("components").getChildren();
        	Iterator iComponents = lComponents.iterator();
        	while ( iComponents.hasNext() ) {
        		Element component = (Element)iComponents.next();
        		String sRole = component.getName();
        		String sName = component.getAttribute("name").getValue();
        		String sClass = component.getAttribute("class").getValue();
        		if ( sName.length() > 0 && sClass.length() > 0 &&
        				m_roleMap.containsKey(sRole) ) 
        		{
        			// validate that the component does indeed have the specified role
        			String sRoleInterface = (String)m_roleMap.get(sRole);
        			Class clComponent = null;
        			try {
        				clComponent = ClassUtil.loadClass( sClass );
        			}
        		    catch(ClassNotFoundException e) {
        		    	throw new ConfigurationException("Unable to find class '"+sClass+"': "+e.getMessage(), e);  
        		    }        			
        			
        			if ( implementsInterface( clComponent, sRoleInterface) ) 
        			{
        				m_componentMap.put(sName, sClass);
        				m_componentConfigMap.put(sName, component);
        			}
        			else
        				throw new ConfigurationException("Component " + sClass + " does not implement interface " + sRoleInterface);
        		}
        	}

        	Element filterElement = (Element) root.getChild("filter");
        	if(filterElement != null) {
        		String filterName = filterElement.getAttributeValue("class");
        		Class filterClass = null;
        		try {
        			filterClass = Class.forName(filterName);
				}
		    	catch(ClassNotFoundException e) {
		    		throw new ConfigurationException("Unable to find class '"+filterName+"': "+e.getMessage(), e);  
		    	}        			
		    
        		if(filterClass == null) {
        			throw new ConfigurationException("Could not find filter class " + filterName);
        		}
        	
        		try {
        			filter = (Filter) filterClass.newInstance();
        		}
        		catch(InstantiationException e) { 
    		    	throw new SystemException("Unable to instantiate filter '"+filterName+"': "+e.getMessage(), e); 
    		    }
    		    catch(IllegalAccessException e) { 
    		    	throw new SystemException("Unable to instantiate filter '"+filterName+"': "+e.getMessage(), e);  
    		    }
    		    
        		filter.initialise(filterElement);
        	}
        }
	}

	/**
	 * Helper method to validate that the specified Class inherits the 
	 * required 'role' interface.
	 * 
	 * @param clazz
	 * @param sInterfaceName
	 * @return
	 */
	private boolean implementsInterface( Class clazz, String sInterfaceName )
	{
		boolean bFoundInterface = false;
		
		if ( clazz != null) {
			Class[] interfaces = clazz.getInterfaces();
			int i = 0;
			while ( !bFoundInterface && i < interfaces.length  ) {
				if ( sInterfaceName.compareTo(interfaces[i].getName()) == 0 ) {
					bFoundInterface = true;
				}
				i++;
			}
			
			// if the interface has not been found then it may be implemented in the superclass.
			if ( !bFoundInterface ) {
				bFoundInterface = implementsInterface( clazz.getSuperclass(), sInterfaceName );
			}
		}
		
		return bFoundInterface;
	}
	
	private Element getComponentConfiguration(String sName)
	{
		return (Element)m_componentConfigMap.get( sName );
	}
	
	/**
	 * Populates the preload cache with objects which the passed method needs to be preloaded.
	 * In other words, these objects are created and cached prior to a service request being received.
	 *  
	 * @param context
	 * @param providerXML
	 * @param preloadCache
	 */
	public void preloadCache(IComponentContext context, Element providerXML, Map preloadCache )
		throws SystemException
	{
		IComponent service = null;
	    
	    if ( providerXML != null &&
	    		SERVICE_METHOD_ELEMENT.compareTo(providerXML.getName()) == 0 &&
	    		providerXML.getChild(PIPELINE_ELEMENT) != null ) 
	    {
	    	List lComponents = providerXML.getChild(PIPELINE_ELEMENT).getChildren();
	    	Iterator itComponents = lComponents.iterator();
	    	while ( itComponents.hasNext() )
	    	{
	    		Element element = (Element)itComponents.next();
			    String elementName = element.getName();
			    String className = (String)m_componentMap.get(elementName);
				
			    if ( className == null || className.length() == 0) {
			    	throw new ConfigurationException("Pipeline component '"+elementName+"' is not associated with a class");
			    }
			    
			    try
				{
			    	service = null;
			    	Class serviceClass = Class.forName( className );
				    service = (IComponent)serviceClass.newInstance();
				}
			    catch(ClassNotFoundException e) { 
			    	throw new ConfigurationException("Unable to instantiate pipeline component for '"+elementName+"': "+e.getMessage(), e); 
			    }
			    catch(InstantiationException e) { 
			    	throw new SystemException("Unable to instantiate pipeline component for '"+elementName+"': "+e.getMessage(), e); 
			    }
			    catch(IllegalAccessException e) { 
			    	throw new SystemException("Unable to instantiate pipeline component for '"+elementName+"': "+e.getMessage(), e); 
			    }
			    
			    if ( service!= null ) {
			    	service.setName(elementName);
			    	service.setContext(context);
			    	service.preloadCache(element, preloadCache);
			    }
	    	}
	    }
	}
	
	public Filter getServiceFilter() {
		return filter;
	}
	
	/**
	 * Returns the pipeline for the requested service method.
	 * 
	 * @param context
	 * @param providerXML - XML template specifying what the method is to do.
	 * @param preloadCache
	 * @return - the service provider interface.
	 * @throws BusinessException
	 * @throws SystemException
	 */
	public IComponent getMethodPipeline(IComponentContext context, Element providerXML, Map preloadCache)
		throws BusinessException, SystemException
	{
		IComponent service = null;
	    IComponent serviceParent = null;
	    
	    if ( providerXML != null &&
	    		SERVICE_METHOD_ELEMENT.compareTo(providerXML.getName()) == 0 &&
	    		providerXML.getChild(PIPELINE_ELEMENT) != null ) 
	    {
	    	List lComponents = providerXML.getChild(PIPELINE_ELEMENT).getChildren();
	    	Iterator itComponents = lComponents.iterator();
	    	while ( itComponents.hasNext() )
	    	{
	    		Element element = (Element)itComponents.next();
			    String elementName = element.getName();
			    String className = (String)m_componentMap.get(elementName);
				
			    if ( className == null || className.length() == 0) {
			    	throw new ConfigurationException("Pipeline component '"+elementName+"' is not associated with a class");
			    }
			    
			    try
				{
			    	service = null;
			    	Class serviceClass = Class.forName( className );
				    service = (IComponent)serviceClass.newInstance();
				}
			    catch(ClassNotFoundException e) {
			    	throw new ConfigurationException("Unable to instantiate pipeline component for '"+elementName+"': "+e.getMessage(), e);  
			    }
			    catch(InstantiationException e) { 
			    	throw new SystemException("Unable to instantiate pipeline component for '"+elementName+"': "+e.getMessage(), e); 
			    }
			    catch(IllegalAccessException e) { 
			    	throw new SystemException("Unable to instantiate pipeline component for '"+elementName+"': "+e.getMessage(), e);  
			    }
			    
			    if ( service!= null )
			    {
			    	service.setName(elementName);
			    	service.setContext(context);
			    	service.prepare(element, preloadCache);
			    	if ( serviceParent != null ) service.setParent(serviceParent);
			    	serviceParent = service;
			    }
	    	}
	    }
	    return service;
	}
	

	/**
	 * Validates the passed component name. Useful if wanted to pre-validate the 
	 * method XML. 
	 * 
	 * @param sComponentName - the name to validate
	 * @return - true or false
	 */
	public boolean isValid( String sComponentName )
	{
		return m_componentMap.containsKey(sComponentName);
	}
	
	/**
	 * Returns all component names (which are also the valid XML tags in the method pipelines).
	 * Useful if, for instance, providing an error msg caused by isValid returning false.
	 *  
	 * @return - comma seperated string
	 */
	public String getComponentNames()
	{
		Set keys = m_componentMap.keySet();
		String sKeys = new String();
		Iterator iKeys = keys.iterator();
		boolean bFirst = true;
		
		while( iKeys.hasNext() )
        {
			if ( bFirst == true ) {
				bFirst = false;
				sKeys += (String)iKeys.next();
			}
			else {
				sKeys += "," + (String)iKeys.next();
			}
        }
		return sKeys;
	}
	
	/**
	 * Validates the generic method template XML and then delegates pipeline Component
	 * validation to the components themselves.
	 * 
	 * @param context
	 * @param handler
	 * @param methodXML
	 * @param preloadCache
	 */
	public void validate(String methodId, IComponentContext context, QueryEngineErrorHandler handler, Element methodXML, Map preloadCache )
		throws SystemException
	{
		if ( handler == null || methodXML == null ) return;

	    // validate root element
	    if ( SERVICE_METHOD_ELEMENT.compareTo(methodXML.getName()) != 0 ) {
	    	handler.raiseError(methodId + " does not define root element <"+SERVICE_METHOD_ELEMENT+">");
	    }
	    else {
	    	// validate the method visibility
	    	Attribute visibilityAttr = methodXML.getAttribute(SERVICE_METHOD_VISIBILITY_ATTRIBUTE);
	    	if ( visibilityAttr != null ) {
	    		String visibility = visibilityAttr.getValue();
	    		if ( SERVICE_METHOD_VISIBILITY_LOCAL_VALUE.compareToIgnoreCase(visibility) != 0 && 
	    				SERVICE_METHOD_VISIBILITY_BOTH_VALUE.compareToIgnoreCase(visibility) != 0) 
	    		{
	    			handler.raiseError(methodId + " has invalid '"+SERVICE_METHOD_VISIBILITY_ATTRIBUTE+"' attribute '"+
	    					visibility+"'. Should be '"+SERVICE_METHOD_VISIBILITY_LOCAL_VALUE+"' or '"+SERVICE_METHOD_VISIBILITY_BOTH_VALUE+"'");
	    		}
	    	}
	    }
	    
	    // validate security
	    Element eSecurity = methodXML.getChild(SECURITY_ELEMENT);
	    if ( eSecurity == null )
	    	handler.raiseError(methodId + " has no '"+SECURITY_ELEMENT+"' element");
		else {
			Attribute roles = eSecurity.getAttribute(SECURITY_ROLES_ATTRIBUTE);
			if (roles == null)
		    	handler.raiseError(methodId + " has no '"+SECURITY_ELEMENT+"' element '"+SECURITY_ROLES_ATTRIBUTE+"' attribute defined");
			else {
				String rolesValue = roles.getValue();
				if ( rolesValue == null || rolesValue.length() == 0) {
			    	handler.raiseError(methodId + " has no '"+SECURITY_ELEMENT+"' element '"+SECURITY_ROLES_ATTRIBUTE+"' attribute defined");
				}
			}
		}
	    
	    // validate pipeline
	    Element ePipeline = methodXML.getChild(PIPELINE_ELEMENT);
	    if ( ePipeline == null ) {
	    	handler.raiseError(methodId + " has no pipeline");
	    }
	    else {
	    	List lComponents = ePipeline.getChildren();
	    	if ( lComponents.size() == 0) {
	    		handler.raiseError(methodId + " has zero length pipeline");
	    	}
	    	
	    	Iterator itComponents = lComponents.iterator();
	    	while ( itComponents.hasNext() )
	    	{
	    		Element element = (Element)itComponents.next();
			    String elementName = element.getName();
			    IComponent service = null;
			    
			    String className = (String)m_componentMap.get(elementName);
			    if ( className == null || className.length() == 0) {
			    	handler.raiseError(methodId + " pipeline component '"+elementName+"' is not associated with a class");
			    }
			    else 
			    {
				    try
					{
				    	service = null;
				    	Class serviceClass = Class.forName( className  );
					    service = (IComponent)serviceClass.newInstance();
					}
				    catch(ClassNotFoundException e) { 
				    	handler.raiseError(methodId +" unable to find class for pipeline component "+elementName );
				    }
				    catch(InstantiationException e) { 
				    	handler.raiseError(methodId +" unable to instantiate pipeline component "+elementName );
				    }
				    catch(IllegalAccessException e) { 
				    	handler.raiseError(methodId +" unable to access pipeline component "+elementName );
				    }
				    
				    if ( service!= null )
				    {
				    	handler.raiseMessage("Validating pipeline component '"+elementName+"':");
				    	
				    	service.setName(elementName);
				    	service.setContext(context);
				    	service.validate(methodId, handler, element, preloadCache );
				    }
			    }
	    	}
	    }
	}
}
