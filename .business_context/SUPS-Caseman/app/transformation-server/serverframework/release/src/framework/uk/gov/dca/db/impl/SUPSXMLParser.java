/*
 * Created on 05-Oct-2004
 *
 */
package uk.gov.dca.db.impl;

import java.io.IOException;
import java.io.StringReader;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.SAXNotRecognizedException;
import org.xml.sax.SAXNotSupportedException;
import org.xml.sax.SAXParseException;
import org.xml.sax.helpers.DefaultHandler;

import uk.gov.dca.db.exception.*;

/**
 * @author Grant Miller
 *
 * Helper class which parses and optionally validates XML.
 */
public class SUPSXMLParser {

	//	XML schema validation statics:
	private static final String JAXP_SCHEMA_LANGUAGE =
	    "http://java.sun.com/xml/jaxp/properties/schemaLanguage";
	private static final String W3C_XML_SCHEMA =
	    "http://www.w3.org/2001/XMLSchema"; 
	private static final String JAXP_SCHEMA_SOURCE =
	    "http://java.sun.com/xml/jaxp/properties/schemaSource";

	
	public void parse(String srcXML, String sXSDFile)
		throws BusinessException, SystemException
	{
		StringReader reader = new StringReader(srcXML);	
		SAXParserFactory factory = SAXParserFactory.newInstance();
		factory.setNamespaceAware(true);
		factory.setValidating(true);
		SAXParser saxParser = null;
		try {
			saxParser = factory.newSAXParser();
		}
		catch(ParserConfigurationException e) {
			throw new SystemException("Failed to create parser: "+e.getMessage(),e);
		}
		catch(SAXException e) {
			throw new SystemException("Failed to create parser: "+e.getMessage(),e);
		}
		
		// set up the schema if specified
        if ( sXSDFile != null || sXSDFile.length() !=0 ) {
    		try {
    			saxParser.setProperty(JAXP_SCHEMA_LANGUAGE, W3C_XML_SCHEMA);  
    		}
    		catch(SAXNotSupportedException e) {
    			throw new SystemException("Failed to initialise parser: "+e.getMessage(),e);
    		}
    		catch(SAXNotRecognizedException e) {
    			throw new SystemException("Failed to initialise parser: "+e.getMessage(),e);
    		}
    		
    		try {
    			saxParser.setProperty(JAXP_SCHEMA_SOURCE, Util.getInputSource(sXSDFile, this) );
    		}
    		catch(SAXNotSupportedException e) {
    			throw new ConfigurationException("Failed to locate XML Schema file '"+sXSDFile+"': "+e.getMessage(),e);
    		}
    		catch(SAXNotRecognizedException e) {
    			throw new SystemException("Failed to initialise parser: "+e.getMessage(),e);
    		}
        }
        
        // now parse the XML
        InputSource xmlSrc = new InputSource(reader);
		DefaultHandler handler = new XSDContentHandler();
		
		try {
			saxParser.parse( xmlSrc, handler);
		}
		catch(IOException e) {
			throw new SystemException("Unable to validate input XML using XML Schema '"+sXSDFile+"': "+e.getMessage(),e);
		}
		catch(SAXParseException e) {
			throw new ValidationException("Input XML is invalid: "+e.getMessage(),e);
		}
		catch(SAXException e) {
			throw new SystemException("Unable to validate input XML using XML Schema '"+sXSDFile+"': "+e.getMessage(),e);
		}
	}
	//ParserConfigurationException, SAXException, SAXNotRecognizedException,
	//SAXNotSupportedException, FileNotFoundException, IOException
	
    protected class XSDContentHandler extends DefaultHandler
	{
    	// make sure errors are thrown on validation failure.
    	// if this is not done then validation errors are ignored.
    	public void error(SAXParseException e) throws SAXParseException
    	{
    	  throw e;
    	}
	}

}
