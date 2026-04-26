package uk.gov.dca.db.pipeline;

import java.io.IOException;
import java.io.StringReader;
import java.util.Map;

import org.jdom.Document;
import org.jdom.JDOMException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Attribute;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.exception.*;

/**
 * Instantiates the specified Java class and calls the method "process"
 * 
 * @author Grant Miller
 */
public class JavaService extends AbstractComponent implements IGenerator {

	private static final Log log = LogFactory.getLog(JavaService.class);
	private String m_classClasspath = null;
	
	public void preloadCache( Element processingInstructions, Map preloadCache ) {}
		
	
	/**
	 * Checks that the configuration of this item is valid 
	 */
    public void validate(String methodId, QueryEngineErrorHandler handler, Element processingInstructions, Map preloadCache)
    	throws SystemException
	{
       	// check there is a 'source' element
    	Element eSource = null;
    	try {
    		eSource = (Element) XPath.selectSingleNode(processingInstructions, "./Source");
		}
    	catch (JDOMException e) { 
    		eSource = null;
    	}
    	
    	if ( eSource == null ) {
    		handler.raiseError("'Source' element missing for '"+getName()+"' [JavaService]");
    		return;
    	}
    	
    	// check that the source element has a classpath for the java class
		Attribute classAttr = eSource.getAttribute("class");
		
		if (classAttr == null)
			handler.raiseError("'class' attribute is required for 'Source' element of '"+getName()+"' [JavaService]");
		else {
			String classValue = classAttr.getValue();
			if (classValue == null || classValue.length() == 0) {
				handler.raiseError("Value required for the 'class' attribute of 'Source' element of '"+getName()+"'. Must provide full classpath [JavaService]");
			}
		}
	}
    
	/**
	 * Reads in the full classpath of the Java class to use.
	 */
    public void prepare(Element config, Map preloadCache) throws SystemException
	{
    	Element element = null;
    	try {
    		element = (Element) XPath.selectSingleNode(config, "./Source");
		}
    	catch (JDOMException e) { 
    		throw new SystemException("Unable to evaluate './Source' for pipeline component '"+this.getName()+"': "+e.getMessage(),e);
    	}
    	if ( element == null ) throw new ConfigurationException("'Source' node missing for '"+this.getName()+"'");
    	
    	boolean bSpecifiedClass = true;
        Attribute classAttr = element.getAttribute("class");
        
        if (classAttr != null) 
        	m_classClasspath = classAttr.getValue();
        else 
        	bSpecifiedClass = false;
        
        if (m_classClasspath.length() == 0 ) bSpecifiedClass = false;
        	
        if ( bSpecifiedClass == false ) {
			throw new ConfigurationException("Java class not specified for '"+this.getName()+"'. Must provide full classpath");
		}
	}


    /**
     * Reads the data source and processes it's contents using Java.
     */
    public void process() throws BusinessException, SystemException
	{   	
        log.debug("Loading class: " + m_classClasspath);
        
       	String sInput = m_dataSrc.toString();
   		SAXBuilder builder = new SAXBuilder();
   		Document parameters = null;
    	try {
    		parameters = builder.build( new StringReader(sInput) );
    	}
    	catch( IOException e ) {
    		throw new SystemException("Unable to read pipeline component input: "+e.getMessage(),e);
    	}
    	catch( JDOMException e ) {
    		throw new BusinessException("Failed to process pipeline component input: "+e.getMessage(),e);
    	}
    	
    	// instantiate the custom processor
    	ICustomProcessor customProcessor = null;
    	try
		{
	    	Class processorClass = Class.forName(m_classClasspath);
	    	customProcessor = (ICustomProcessor)processorClass.newInstance();
		}
	    catch(ClassNotFoundException e) { 
	    	throw new ConfigurationException("Unable to find custom processor '"+m_classClasspath+"': "+e.getMessage(),e);
	    }
	    catch(InstantiationException e) { 
	    	throw new SystemException("Unable to instantiate custom processor '"+m_classClasspath+"': "+e.getMessage(),e);
	    }
	    catch(IllegalAccessException e) { 
	    	throw new SystemException("Unable to instantiate custom processor '"+m_classClasspath+"': "+e.getMessage(),e);
	    }
	    
	    if ( customProcessor == null ) {
	    	throw new BusinessException("Failed to instantiate class '"+m_classClasspath+"'" );
	    }
	    
	    //make sure we output valid XML doc
	    try {
    		m_dataSink.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
    	}
    	catch( IOException e ) {
    		throw new SystemException("Failed to write to data sink", e);
    	}
    	
	    // do the actual processing
    	customProcessor.setContext(m_context);
    	customProcessor.process(parameters,m_dataSink,log);
	    
	}
}