package uk.gov.dca.caseman.tools;

import java.util.HashMap;

import javax.xml.transform.Templates;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;

import org.apache.avalon.framework.logger.ConsoleLogger;
import org.apache.avalon.framework.logger.Logger;

/**
 * Factory to generate and cache Templates objects for use in transformations.
 * URIs are resolved using the custom WPUriResolver to allow stylesheets to be
 * read directly from the jar file rather than over HTTP.
 * @author Nick Wilson
 * @version WP-1.13
 */
public class TemplatesFactory {
    /** Logger for handling log messages. */
    private Logger log = null;
    /** Reference to the single instance of the factory. */
	private static TemplatesFactory templatesFactory = null;
    /** Cache for Templates objects keyed on the URI String. */
	private HashMap templateCache;
    /** Custom URI resolver. */
	private WPUriResolver uriResolver;
    /** Transformer factory for Transformer instances using custom URI resolver. */
	private TransformerFactory transformerFactory;
    /** Flag to indicate if the templates should be cached. */
	boolean cache;
    
	/**
     * Private constructor for Singleton class. Use the getInstance method to
     * obtain a reference to the instance.
	 */
    private TemplatesFactory(boolean cache) 
    {
    	if (log == null)
        {
            log = new ConsoleLogger(ConsoleLogger.LEVEL_DEBUG);
        }
    	log.debug("TemplatesFactory instantiation");
        if (cache) {
            templateCache = new HashMap();
        }
		uriResolver = new WPUriResolver();
		log.debug("TemplatesFactory instantiation - uriResolver="+uriResolver);
		transformerFactory = TransformerFactory.newInstance();
		log.debug("TemplatesFactory instantiation - transformerFactory="+transformerFactory);
		transformerFactory.setURIResolver(uriResolver);
    
		
	}

    /**
     * Returns the single instance of the TemplatesFactory class.
     */
	public static TemplatesFactory getInstance() {
		return getInstance(true);
	}
	
    /**
     * Returns the single instance of the TemplatesFactory class.
     */
    public static TemplatesFactory getInstance(boolean cache) {
        if (templatesFactory == null) {
            templatesFactory = new TemplatesFactory(cache);
        }
        return templatesFactory;
    }
    
	/**
     * Returns a Templates object corresponding to the given URI.
	 */
    public Templates getTemplates(String uri) throws TransformerException 
	{
		Templates templates;
        if (cache) {
            templates = (Templates) templateCache.get(uri);
    		if (null == templates) 
    		{
    			templates = transformerFactory.newTemplates(uriResolver.resolve(uri, null));
    			templateCache.put(uri, templates);
    		}
        } else {
            templates = transformerFactory.newTemplates(uriResolver.resolve(uri, null));
        }
		return templates;
	}
}
