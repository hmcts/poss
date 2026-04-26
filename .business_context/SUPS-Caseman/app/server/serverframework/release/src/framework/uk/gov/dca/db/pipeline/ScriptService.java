package uk.gov.dca.db.pipeline;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.io.Writer;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.JavaScriptException;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.WrappedException;

import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.ejb.SupsRemoteServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Runs the specified Javascript file.
 * 
 * @author Grant Miller
 */
public class ScriptService extends AbstractComponent2 implements IGenerator {

	private static final Log log = SUPSLogFactory.getLogger(ScriptService.class);
	private String m_scriptURI = null;
	
	
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
    		handler.raiseError("'Source' element missing for '"+getName()+"' [ScriptService]");
    		return;
    	}
    	
    	// check that the source element has a location for the js file
		Attribute location = eSource.getAttribute("location");
		
		if (location == null)
			handler.raiseError("'location' attribute is required for 'Source' element of '"+getName()+"' [ScriptService]");
		else {
			String locationValue = location.getValue();
			if (locationValue == null || locationValue.length() == 0) {
				handler.raiseError("Value required for the 'location' attribute of 'Source' element of '"+getName()+"' [ScriptService]");
			}
		}
	}
    
	/**
	 * Reads in the filename of the Javascript file to use.
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
     * Reads the datasource and processes it's contents using Javascript.
     */
    public void process() throws BusinessException, SystemException
	{   	
        log.debug("Loading script file: " + m_scriptURI);
        
        // now get/create the Rhino Javascript context for this thread
        Context cx = Context.enter();

        try 
		{
        	Document parameters = (Document)this.m_inputData.getData(Document.class);
        	Writer out = new StringWriter();
        	this.m_outputData.setData(out, Writer.class);
        	
        	// get the scope and add any Java objects we want to be accessible from Javascript
            Scriptable scope = cx.initStandardObjects();
            
            Object jsParameters = Context.javaToJS(parameters, scope);
            ScriptableObject.putProperty(scope, "parameters", jsParameters);
            
            Object jsOut = Context.javaToJS(out, scope);
            ScriptableObject.putProperty(scope, "out", jsOut);

            Object jsLog = Context.javaToJS(log, scope);
            ScriptableObject.putProperty(scope, "log", jsLog);
            
            Object jsContext = Context.javaToJS(m_context, scope);
            ScriptableObject.putProperty(scope, "context", jsContext);
            
            Object jsEJBLocalProxy = Context.javaToJS( new SupsLocalServiceProxy(), scope);
            ScriptableObject.putProperty(scope, "LocalService", jsEJBLocalProxy);

            Object jsEJBRemoteProxy = Context.javaToJS( new SupsRemoteServiceProxy(), scope);
            ScriptableObject.putProperty(scope, "RemoteService", jsEJBRemoteProxy);
            
            // run the specified script
            InputStream jsSrc = Util.getInputStream(m_scriptURI, this);
            InputStreamReader jsSrcReader = new InputStreamReader(jsSrc);

            try {
            	out.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
        	}
        	catch( IOException e) {
        		throw new SystemException("Write to data sink failed: "+e.getMessage(), e);
            }
            
            Object result = null;
            try {
            	result = cx.evaluateReader(scope, jsSrcReader, "<cmd>", 1, null);
            }
            catch ( IOException e) {
            	throw new SystemException("Failed to run validation Javascript: "+e.getMessage(), e);
            }
            catch(JavaScriptException e) {
            	throw new SystemException("Failed to run validation Javascript: "+e.getMessage(), e);
    		}
            catch(WrappedException e) {
            	Throwable wrappedException = e.getWrappedException();
            	if ( wrappedException instanceof SystemException) {
            		throw (SystemException)wrappedException;
            	}
            	if ( wrappedException instanceof BusinessException) {
            		throw (BusinessException)wrappedException;
            	}
            	
            	throw e;
            }
        }
        finally {
        	// make sure the Javascript context is freed up.
        	Context.exit();
		}

	}
}