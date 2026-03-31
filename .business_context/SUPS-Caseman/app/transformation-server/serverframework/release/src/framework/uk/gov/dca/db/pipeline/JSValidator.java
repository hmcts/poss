/*
 * Created on 27-Aug-2004
 *
 */
package uk.gov.dca.db.pipeline;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.Writer;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.JavaScriptException;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.exception.*;
import uk.gov.dca.db.impl.Util;

/**
 * Validates the input using the specified Javascript file. throws an exception if invalid.
 *
 * @author Grant Miller
 */
public class JSValidator extends AbstractComponent implements IValidator {
	
	private static final Log log = LogFactory.getLog(JSValidator.class);
	private String m_scriptURI = null;
	
	public void preloadCache( Element processingInstructions, Map cache ){}

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
    		handler.raiseError("'Source' element missing for '"+getName()+"' [JSValidator]");
    		return;
    	}
    	
    	// check that the source element has a location for the js file
		Attribute location = eSource.getAttribute("location");
		
		if (location == null)
			handler.raiseError("'location' attribute is required for 'Source' element of '"+getName()+"' [JSValidator]");
		else {
			String locationValue = location.getValue();
			if (locationValue == null || locationValue.length() == 0) {
				handler.raiseError("Value required for the 'location' attribute of the 'Source' element of '"+getName()+"' [JSValidator]");
			}
		}
	}
    
    /**
     * Reads in the name of the Javascript source file to use for validation.
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
    	
		boolean bSpecifiedScript = true;
		Attribute location = element.getAttribute("location");
		
		if (location != null)
			m_scriptURI = location.getValue();
		else 
			bSpecifiedScript = false;
		
		if (m_scriptURI.length() == 0 ) bSpecifiedScript = false;
			
		if ( bSpecifiedScript == false ) {
			throw new ConfigurationException("Javascript file not specified for '"+this.getName()+"'");
		}
	}
		
	/**
	 * Validates the input using the specified Javascript file.
	 */
    protected void process() throws BusinessException, SystemException
    {
        log.debug("Loading script file: " + m_scriptURI);
        
        // now get/create the Rhino Javascript context for this thread
        Context cx = Context.enter();
       
        try
		{
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
	    		throw new BusinessException("Unable to process pipeline component input: "+e.getMessage(),e);
	    	}
    	
        	// get the scope and add any Java objects we want to be accessible from Javascript
            Scriptable scope = cx.initStandardObjects();
            
            Object jsParameters = Context.javaToJS(parameters, scope);
            ScriptableObject.putProperty(scope, "parameters", jsParameters);
            
            Object jsLog = Context.javaToJS(log, scope);
            ScriptableObject.putProperty(scope, "log", jsLog);
            
            JSResult oResult = new JSResult();
            Object jsReturnValue = Context.javaToJS(oResult, scope);
            ScriptableObject.putProperty(scope, "valid", jsReturnValue);
            
            Writer sError = new StringWriter();
            Object jsError = Context.javaToJS(sError, scope);
            ScriptableObject.putProperty(scope, "error", jsError);
            
            // run the specified script
            InputStream jsSrc = Util.getInputStream(m_scriptURI, this);
            InputStreamReader jsSrcReader = new InputStreamReader(jsSrc);

            Object result = null;
            try {
            	result = cx.evaluateReader(scope, jsSrcReader, "<cmd>", 1, null);
            }
            catch ( IOException e) {
            	throw new SystemException("Failed to load validation Javascript: "+e.getMessage(), e);
            }
            catch(JavaScriptException e) {
            	throw new SystemException("Failed to run validation Javascript: "+e.getMessage(), e);
    		}
            
            // now handle returned validity flag
            if ( oResult.isValid() == false ) {
            	throw new ValidationException("Validation failed: " + sError.toString() );
            }
            else {
            	try {
            		m_dataSink.write(sInput);
            	}
            	catch( IOException e) {
                	throw new SystemException("Write to data sink failed: "+e.getMessage(), e);
                }
            }
        }
        finally {
        	// make sure the Javascript context is freed up.
        	Context.exit();
		}
       
    }
    
    // utility class to hold result from javascript (using a Boolean object does not work)
    protected class JSResult
	{
    	boolean m_bResult = false;
    	
    	public void setTrue()
    	{
    		m_bResult = true;
    	}
    	
    	public void setFalse()
    	{
    		m_bResult = false;
    	}
    	
    	public boolean isValid()
    	{
    		return m_bResult;
    	}
    	
    	
	}
}
