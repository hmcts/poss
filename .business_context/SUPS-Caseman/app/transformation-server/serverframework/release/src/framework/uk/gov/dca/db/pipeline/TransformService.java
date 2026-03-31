package uk.gov.dca.db.pipeline;

import java.io.StringReader;
import java.util.Map;

import org.jdom.JDOMException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;
import org.jdom.transform.JDOMSource;

import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.xslt.SUPSTransformer;
import java.io.FileNotFoundException;
import java.io.IOException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.sax.SAXSource;

import org.xml.sax.InputSource;

import uk.gov.dca.db.impl.Util;
import uk.gov.dca.db.exception.*;

/**
 * Applies a given XSLT template to the input XML.
 * 
 * @author Grant Miller
 */
public class TransformService extends AbstractComponent implements IGenerator {

	private static final Log log = LogFactory.getLog(TransformService.class);
	
	// the xsl template to use:
	private String m_sXsltTemplate = null;
	// the xpath to use upon the input to get the xml to transform [Optional]
	private String m_srcXPath = null;
	
	public void preloadCache( Element processingInstructions, Map preloadCache ) {}
	
	/**
	 * Validates the XML configuration of this component
	 */
    public void validate(String methodId, QueryEngineErrorHandler handler, Element processingInstructions, Map preloadCache)  
		throws SystemException
	{
		// The src attribute is optional, but if specified check if it is empty
		Attribute xmlSrc = processingInstructions.getAttribute("src");
		if ( xmlSrc != null ) {
			String srcValue = xmlSrc.getValue();
			if ( srcValue == null || srcValue.length() == 0 ) {
				handler.raiseWarning("A value has not been supplied for the 'src' attribute of '"+getName()+"' [TransformService]");
			}
		}
		
		// check there is a 'Template' element.
    	Element eTemplate = null;
    	try {
    		eTemplate = (Element) XPath.selectSingleNode(processingInstructions, "./Template");
		}
    	catch (JDOMException e) { 
    		eTemplate = null;
    	}
    	
    	if ( eTemplate == null ) {
    		handler.raiseError("'Template' element missing for '"+getName()+"' [TransformService]");
    		return;
    	}
    	
    	// check that the source element has a location for the js file
		Attribute location = eTemplate.getAttribute("location");
		
		if (location == null)
			handler.raiseError("'location' attribute is required for 'Template' element of '"+getName()+"' [TransformService]");
		else {
			String locationValue = location.getValue();
			if (locationValue == null || locationValue.length() == 0) {
				handler.raiseError("Value required for the 'location' attribute of the 'Template' element of '"+getName()+"' [TransformService]");
			}
		}
	}
    
	/**
	 * Reads in the name of the XSLT file to use.
	 */
    public void prepare(Element config, Map preloadCache) throws SystemException
	{	
    	// see if a specific xpath to xml source has been specified. Optional.
    	// defaults to whole XML.
    	String srcXPath = config.getAttributeValue("src");
    	if ( srcXPath != null && srcXPath.length() > 0) {
    		m_srcXPath = srcXPath;
    	}
    	
    	// get the template to use
    	Element templateElement = null;
    	try {
			templateElement = (Element) XPath.selectSingleNode(config, "./Template");
		}
    	catch (JDOMException e) { 
    		throw new SystemException("Unable to evaluate './Template' for pipeline component '"+this.getName()+"': "+e.getMessage(),e);
    	}
    	if ( templateElement == null ) throw new ConfigurationException("'Template' node missing for '"+this.getName()+"'");
    	
    	boolean bSpecifiedXSLT = true;
        Attribute location = templateElement.getAttribute("location");
        
        if (location != null) 
        	m_sXsltTemplate = location.getValue();
        else 
        	bSpecifiedXSLT = false;
        
        if (m_sXsltTemplate.length() == 0 ) bSpecifiedXSLT = false;
        	
        if ( bSpecifiedXSLT == false ) {
        	throw new ConfigurationException("XSLT template not specified for '"+this.getName()+"'");
        }
	}

    /**
     * Reads the datasource and processes it's contents
     */
    public void process() throws SystemException
	{    	
        log.debug("Loading template: " + m_sXsltTemplate);
        
        StringReader reader = new StringReader(m_dataSrc.toString());
    	InputSource xsltSrc = null;
		xsltSrc = Util.getInputSource(m_sXsltTemplate, this);
		
    	// see if we need to select the XML to transform from the input XML.
    	if (m_srcXPath == null)
    	{
    		// do the transform on the whole input
    		SUPSTransformer theTransformer = new SUPSTransformer();
    		try {
    			theTransformer.transform(xsltSrc, new InputSource(reader), m_dataSink);
    		}
    		catch(FileNotFoundException e) {
    			throw new ConfigurationException("Failed to load XSL file '"+m_sXsltTemplate+"':"+e.getMessage(), e);
    		}
    		catch(TransformerException e) {
    			throw new ConfigurationException("XSL transform failed '"+m_sXsltTemplate+"':"+e.getMessage(), e);
    		}
    	}
    	else
    	{
    		log.debug("Selecting XML to transform: "+m_srcXPath);
    		
			SAXBuilder builder = new SAXBuilder();
			Document doc = null;
			try {
				doc = builder.build(reader);
        	}
    		catch(IOException e) {
        		throw new SystemException("Failed to read pipeline component input: "+e.getMessage(),e);
    		}
    		catch(JDOMException e) {
        		throw new ConfigurationException("Failed to process pipeline component input: "+e.getMessage(),e);
			}
    		
			Element root = doc.getRootElement();
			
			// select the content of the specified element
			Element eSrcXML = null;
			try {
				eSrcXML = (Element)XPath.selectSingleNode(root, m_srcXPath+"/*");
			}
    		catch(JDOMException e) {
    			throw new SystemException("Failed to evaluate content of '"+m_srcXPath+"': "+e.getMessage(), e);
			}
    		
			if ( eSrcXML == null ) {
				throw new ConfigurationException("Failed to find source element '"+m_srcXPath+"' in XML input");
			}
			
			//now do the transform
			SUPSTransformer theTransformer = new SUPSTransformer();
    		try {
    			theTransformer.transform(new SAXSource(xsltSrc) , new JDOMSource(eSrcXML), m_dataSink);
    		}
    		catch(TransformerException e) {
    			throw new SystemException("XSL transform '"+m_sXsltTemplate+"' failed: "+e.getMessage(), e);
    		}
    	}
	}
}