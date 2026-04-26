/*
 * Created on 05-Oct-2004
 *
 */
package uk.gov.dca.db.pipeline;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.JavaScriptException;
import org.mozilla.javascript.Scriptable;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.exception.ValidationException;
import uk.gov.dca.db.impl.SUPSXMLParser;
import uk.gov.dca.db.impl.Util;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Validates the input using the specified XML Schema file.
 * NOTE: unfortunately JDK 1.4 only allows validation while parsing. Therefore
 * existing XML objects (DOM/JDOM/SAX events) cannot be validated.
 *
 * @author Grant Miller
 */
public class FormValidator extends AbstractComponent2 implements IValidator {

	private static final Log log = SUPSLogFactory.getLogger(FormValidator.class);
	
	private String m_XSDFile = null;
	private String m_formId = null;
	private String m_valueXPath = null;
	
	//JS validation statics:
	private static final String JS_FORM_VALIDATION_FILE = "uk/gov/dca/db/pipeline/validateForm.js";
	private static final String JS_FUNCTION = "validateForm";
	
	/**
	 * Nothing to preload here.
	 */
	public void preloadCache( Element processingInstructions, Map preloadCache ) {}
	
	/**
	 * Validates the method XML for this component.
	 */
    public void validate(String methodId, QueryEngineErrorHandler handler, Element processingInstructions, Map preloadCache)  
		throws SystemException
	{
    	String formId = processingInstructions.getAttributeValue("formId");
    	String xmlXPath = processingInstructions.getAttributeValue("value");
    	String schema = processingInstructions.getAttributeValue("schema");
    	
		// form id is needed
		if (formId == null || formId.length() ==0) {
			handler.raiseError("No 'formId' provided for '"+getName()+"' [FormValidator]");
		}
		// schema is optional
		if (schema == null || schema.length() ==0) {
			handler.raiseWarning("No 'schema' provided for '"+getName()+"' [FormValidator]");
		}
		// xpath is optional
		if (xmlXPath == null || xmlXPath.length() ==0) {
			handler.raiseWarning("No xpath for 'value' provided for '"+getName()+"' [FormValidator]");
		}
	}
    
	/**
	 * Reads in the config info.
	 */
    public void prepare(Element config, Map preloadCache) throws SystemException
	{	
    	String formId = config.getAttributeValue("formId");
    	String xmlXPath = config.getAttributeValue("value");
    	String schema = config.getAttributeValue("schema");
    	
    	// now perform brief runtime validation of form id.
    	// The xpath and schema can be null/empty.
    	if (formId == null || formId.length() ==0) {
    		throw new ConfigurationException("No 'formId' provided for '"+this.getName()+"'");
    	}
    	
    	// assign values to members
    	m_formId = formId;
    	m_valueXPath = xmlXPath;
		m_XSDFile = schema;
	}
    
    /**
     * Reads the datasource and attempts to validate it using XML Schema.
     */
    public void process() throws BusinessException, SystemException
	{    	
		// first make sure that the output is identical to the input
		String sInput = (String)this.m_inputData.getData(String.class);
			
        // Note: validation using the xml schema is done using standard SAXParser.
        // Javascript validation of the XML requires a JDOM document. Therefore 
        // the XML string is effectively parsed twice.
        // Also: xpath param is ignored for XML Schema validation because otherwise it would imply
        // that we have previously parsed and formed a dom in order to evaluate the xpath.
        if(log.isInfoEnabled()){
            if ( m_XSDFile != null && m_XSDFile.length() > 0 ){
                log.info("Validating form '"+m_formId+"' using XML Schema '"+m_XSDFile+"'" );
            }else{
                log.info("Parsing form '"+m_formId+"'. No XML Schema specfied" );
            }
        }

        SUPSXMLParser parser = new SUPSXMLParser();
        parser.parse(sInput, m_XSDFile);    
        if(log.isInfoEnabled()){
            log.info("Validating form '"+m_formId+"' using Javascript '"+JS_FORM_VALIDATION_FILE+"'" );
        }

        validateForm(m_formId, sInput, m_valueXPath);
        
        this.m_outputData.setData( this.m_inputData );
	}
    
    
    /**
     * Validates the input XML using a Javascript call to the specified function
     * ( in static var JS_FUNCTION )
     * 
     * @param formId
     * @param srcXML
     * @param fragmentXPath
     */
    private void validateForm(String formId, String srcXML, String fragmentXPath)
    	throws BusinessException, SystemException
    {
        // now get/create the Rhino Javascript context for this thread
        Context cx = Context.enter();
        try
		{
	        SAXBuilder builder = new SAXBuilder();
	    	Document parameters = null;
	    	Element eSrc = null;
	    	try {
	    		parameters = builder.build( new StringReader(srcXML) );
	    	}
	    	catch( IOException e ) {
	    		throw new SystemException("Unable to read pipeline component input: "+e.getMessage(),e);
	    	}
	    	catch( JDOMException e ) {
	    		throw new BusinessException("Unable to process pipeline component input: "+e.getMessage(),e);
	    	}
	    	
	    	if ( fragmentXPath == null || fragmentXPath.length() == 0)
	    		eSrc = parameters.getRootElement();
	    	else {
	    		try {
	    			eSrc = (Element)XPath.selectSingleNode(parameters, fragmentXPath);
	    		}
		    	catch( JDOMException e ) {
		    		throw new SystemException("Unable to evaluate '"+fragmentXPath+"' against input: "+e.getMessage(),e);
		    	}
	    	}
	    	
        	// get the scope and add any Java objects we want to be accessible from Javascript
            Scriptable scope = cx.initStandardObjects();
       
            // load the validation script and call the validate function
            InputStream jsSrc = Util.getInputStream(JS_FORM_VALIDATION_FILE, this);
            InputStreamReader jsSrcReader = new InputStreamReader(jsSrc);

            try {
            	cx.evaluateReader(scope, jsSrcReader, "<cmd>", 1, null);
			}
        	catch ( IOException e) {
        		throw new SystemException("Failed to load validation Javascript: "+e.getMessage(), e);
        	}
        	catch(JavaScriptException e) {
            	throw new SystemException("Failed to process validation Javascript: "+e.getMessage(), e);
    		}
        	
            // Call javascript function to do the validation
            Object funcObj = scope.get(JS_FUNCTION, scope);
            if (!(funcObj instanceof Function)) {
                throw new ConfigurationException("'"+JS_FUNCTION+"' is undefined or not a function.");
            } else {
                Object functionArgs[] = { formId, eSrc };
                Function validateFunction = (Function)funcObj;
                Object result = null;
                try {
                	validateFunction.call(cx, scope, scope, functionArgs);
                }
            	catch(JavaScriptException e) {
                	throw new SystemException("Failed to execute validation Javascript: "+e.getMessage(), e);
        		}
                
                // now handle result. If validated then result will be null:
                if ( result != null) {
                	throw new ValidationException("Invalid input for form '"+formId+"': "+Context.toString(result));
                }
                if(log.isDebugEnabled()){
                    log.debug("Result of calling Javascript function '"+JS_FUNCTION+"':" + Context.toString(result));
                }

            }
        }
        finally {
        	// make sure the Javascript context is freed up.
        	Context.exit();
		}
    }
}
