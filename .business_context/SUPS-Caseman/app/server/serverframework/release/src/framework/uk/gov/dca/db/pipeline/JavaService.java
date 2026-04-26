package uk.gov.dca.db.pipeline;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.util.ClassUtil;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Instantiates the specified Java class and calls the method "process"
 * 
 * @author Grant Miller
 */
public class JavaService extends AbstractComponent2 implements IGenerator {

	private static final Log log = SUPSLogFactory.getLogger(JavaService.class);
	private static final String CALL_STYLE_ATTR = "callStyle";
	private static final String NEW_CALL_STYLE = "new";
	private static final String OLD_CALL_STYLE = "old";
	
	private String m_classClasspath = null;
	private boolean useNewCallStyle = false;
	
	public void preloadCache( Element processingInstructions, Map preloadCache ) {}
		
	
	/**
	 * Checks that the configuration of this item is valid 
	 */
    public void validate(String methodId, QueryEngineErrorHandler handler, Element processingInstructions, Map preloadCache)
    	throws SystemException
	{
      	
    	// validate call style if provided
    	String callStyleCfg = processingInstructions.getAttributeValue("callStyle");
    	if ( callStyleCfg != null && callStyleCfg.length() > 0 &&
    			( NEW_CALL_STYLE.compareToIgnoreCase(callStyleCfg)!=0 && 
    					OLD_CALL_STYLE.compareToIgnoreCase(callStyleCfg)!=0) )
    	{
    		handler.raiseError("'callStyle' attribute must be 'old' or 'new'. Invalid value '"+callStyleCfg+"' for '"+getName()+"' [JavaService]");
    	}
    	
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
    	// get the call style - defaults to original (old) version 
    	String callStyleCfg = config.getAttributeValue("callStyle");
    	if ( callStyleCfg != null && callStyleCfg.length() > 0 &&
    			NEW_CALL_STYLE.compareToIgnoreCase(callStyleCfg)==0 )
    	{
    		useNewCallStyle=true;
    	}
    	
    	// now get info about plug-in class to use
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
        if ( log.isDebugEnabled() ) {
        	log.debug("Loading class: " + m_classClasspath);
        }
        
    	// instantiate the custom processor
    	ICustomProcessor oldStyleCustomProcessor = null;
    	ICustomProcessor2 newStyleCustomProcessor = null;
    	
    	try
		{
	    	Class processorClass = ClassUtil.loadClass(m_classClasspath);
	    	if ( useNewCallStyle )
	    	{
	    		newStyleCustomProcessor = (ICustomProcessor2)processorClass.newInstance();
		    }
	    	else
	    	{
	    		oldStyleCustomProcessor = (ICustomProcessor)processorClass.newInstance();
		    }

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
	    
	    if ( oldStyleCustomProcessor == null && newStyleCustomProcessor == null ) {
	    	throw new BusinessException("Failed to instantiate class '"+m_classClasspath+"'" );
	    }
    	 	
    	if ( useNewCallStyle )
    	{
    		// new, more efficient style call
    		newStyleCustomProcessor.setContext(m_context);
    		newStyleCustomProcessor.process(this.m_inputData, this.m_outputData, log);
    	}
    	else
    	{
    		// original style call
    		oldStyleCustomProcessor.setContext(m_context);
       		Document parameters = (Document)this.m_inputData.getData(Document.class);
        	
    		// make sure we output valid XML doc
    	    Writer out = new StringWriter();
        	try {
    	    	out.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
        	}
        	catch( IOException e ) {
        		throw new SystemException("Failed to write to data sink", e);
        	}
        	
        	oldStyleCustomProcessor.process(parameters,out,log);
        	this.m_outputData.setData(out, Writer.class);	
    	}
    	    
	}
}