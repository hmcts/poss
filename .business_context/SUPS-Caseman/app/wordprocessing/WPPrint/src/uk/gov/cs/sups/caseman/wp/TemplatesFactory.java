package uk.gov.cs.sups.caseman.wp;

import java.util.HashMap;

import javax.xml.transform.Templates;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;

//import org.apache.avalon.framework.logger.ConsoleLogger;
//import org.apache.avalon.framework.logger.Logger;
//import org.apache.fop.messaging.MessageHandler;

/**
 * Factory to generate and cache Templates objects for use in transformations.
 * URIs are resolved using the custom WPUriResolver to allow stylesheets to be
 * read directly from the jar file rather than over HTTP.
 * @author Nick Wilson
 * @version WP-1.13
 */
public class TemplatesFactory {
    /** Logger for handling log messages. */
  //  private Logger log = null;
    /** Reference to the single instance of the factory. */
	private static TemplatesFactory templatesFactory = null;
    /** Cache for Templates objects keyed on the URI String. */
	private HashMap cache;
    /** Custom URI resolver. */
	private WPPrintUriResolver uriResolver;
    /** Transformer factory for Transformer instances using custom URI resolver. */
	private TransformerFactory transformerFactory;
	
	/**
     * Private constructor for Singleton class. Use the getInstance method to
     * obtain a reference to the instance.
	 */
    private TemplatesFactory() {
		cache = new HashMap();
		uriResolver = new WPPrintUriResolver();
		transformerFactory = TransformerFactory.newInstance();
		transformerFactory.setURIResolver(uriResolver);
    //    if (log == null)
      //  {
        //    log = new ConsoleLogger(ConsoleLogger.LEVEL_DEBUG);
          //  MessageHandler.setScreenLogger(log);
        //}
    }
    /**
     * Returns the single instance of the TemplatesFactory class.
     */
	public static TemplatesFactory getInstance() {
		if (templatesFactory == null) {
			templatesFactory = new TemplatesFactory();
		}
		return templatesFactory;
	}
	
	/**
     * Returns a Templates object corresponding to the given URI.
	 */
    public Templates getTemplates(String uri) throws TransformerException {
		Templates templates = (Templates) cache.get(uri);
		if (null == templates) {
			templates = transformerFactory.newTemplates(uriResolver.resolve(uri, null));
			cache.put(uri, templates);
		}
		return templates;
	}
    /**
     * @param localAddr
     */
    public void setHost(String localAddr) {
        uriResolver.setHost(localAddr);
    }
}
