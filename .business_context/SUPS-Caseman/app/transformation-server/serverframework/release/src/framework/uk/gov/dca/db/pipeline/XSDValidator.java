/*
 * Created on 27-Aug-2004
 *
 */
package uk.gov.dca.db.pipeline;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Attribute;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;
import org.xml.sax.InputSource;

import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.impl.SUPSXMLParser;
import uk.gov.dca.db.impl.Util;
import uk.gov.dca.db.exception.*;

import java.util.List;
import java.util.ArrayList;

import javax.xml.transform.TransformerException;

import uk.gov.dca.db.xslt.SUPSTransformer;

/**
 * Validates the input using the specified XML Schema file.
 * NOTE: unfortunately JDK 1.4 only allows validation while parsing. Therefore
 * existing XML objects (DOM/JDOM/SAX events) cannot be validated.
 *
 * @author Grant Miller
 */
public class XSDValidator extends AbstractComponent implements IValidator {

	private static final Log log = LogFactory.getLog(XSDValidator.class);
	private String m_sXsd = null;
		
	public void preloadCache( Element processingInstructions, Map preloadCache ) {}

	/**
	 * Checks that the configuration of this item is valid 
	 */
    public void validate(String methodId, QueryEngineErrorHandler handler, Element processingInstructions, Map preloadCache)  
		throws SystemException
	{
       	// check there is a 'Schema' element
    	Element eSchema = null;
    	try {
    		eSchema = (Element) XPath.selectSingleNode(processingInstructions, "./Schema");
		}
    	catch (JDOMException e) { 
    		eSchema = null;
    	}
    	
    	if ( eSchema == null ) {
    		handler.raiseError("'Schema' element missing for '"+getName()+"' [XSDValidator]");
    		return;
    	}
    	
    	// check that the Schema element has a location for the xsd file
		Attribute location = eSchema.getAttribute("location");
		
		if (location == null)
			handler.raiseError("'location' attribute is required for 'Schema' element of '"+getName()+"' [XSDValidator]");
		else {
			String locationValue = location.getValue();
			if (locationValue == null || locationValue.length() == 0) {
				handler.raiseError("Value required for the 'location' attribute of the 'Schema' element of '"+getName()+"' [XSDValidator]");
			}
		}
	}
    
	/**
	 * Reads in the name of the schema file to use.
	 */
    public void prepare(Element config, Map preloadCache) throws SystemException
	{	
    	Element element = null;
    	try {
    		element = (Element) XPath.selectSingleNode(config, "./Schema");
		}
    	catch (JDOMException e) {
    		throw new SystemException("Unable to evaluate './Schema' for pipeline component '"+this.getName()+"': "+e.getMessage(),e);
    	}
    	if ( element == null ) throw new ConfigurationException("'Schema' node missing for '"+this.getName()+"'");
    	
    	boolean bSpecifiedXSD = true;
        Attribute location = element.getAttribute("location");
        
        if (location != null) 
        	m_sXsd = location.getValue();
        else 
        	bSpecifiedXSD = false;
        
        if (m_sXsd.length() == 0 ) bSpecifiedXSD = false;
        	
        if ( bSpecifiedXSD == false ) {
        	throw new ConfigurationException("Schema file not specified for '"+this.getName()+"'");
        }
	}
    
    /**
     * Reads the datasource and attempts to validate it using XML Schema.
     */
    public void process() throws BusinessException, SystemException
	{    	
		log.debug("Loading schema: " + m_sXsd);
		
		// first make sure that the output is identical to the input
		String sInput = m_dataSrc.toString();
		
		List filteredElements = new ArrayList();
		XMLFilter scnFilter = new XMLFilter();
		String filteredInput = scnFilter.filter(sInput);
		
		log.debug("Filtered XSD input to remove SCNs");
		
		try {
        	m_dataSink.write(sInput);
        }
        catch( IOException e) {
        	throw new SystemException("Write to data sink failed: "+e.getMessage(), e);
        }
	
        // First filter out any 'SCN' elements
        // Unfortunately, currently can only validate while parsing.
		// Therefore parse the source and validate.
        SUPSXMLParser parser = new SUPSXMLParser();
        parser.parse( filteredInput, m_sXsd);
	}
    
    protected class XMLFilter {
    	private static final String XSLT_FILE = "uk/gov/dca/db/pipeline/filter.xsl";
    	
    	public XMLFilter() {
    	}
    	
    	public String filter( String xmlString ) throws SystemException {
    		SUPSTransformer transformer = new SUPSTransformer();
    		InputSource xsltSrc = Util.getInputSource(XSLT_FILE, this);
    		StringReader inputReader = new StringReader(xmlString);
    		StringWriter outputWriter = new StringWriter();
    			
    		try {
    			transformer.transform(xsltSrc, new InputSource(inputReader), outputWriter );
	    	}
			catch(FileNotFoundException e) {
				throw new ConfigurationException("Failed to load XSL file '"+XSLT_FILE+"':"+e.getMessage(), e);
			}
			catch(TransformerException e) {
				throw new ConfigurationException("XSL transform failed '"+XSLT_FILE+"':"+e.getMessage(), e);
			}
    					
    		return outputWriter.toString();
    	}
    }
}
