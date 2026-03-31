/*
 * Created on 13-Aug-2004
 *
 */
package uk.gov.dca.db.ejb;

import java.io.StringReader;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Node;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;
import org.jdom.input.SAXBuilder;
import org.jdom.JDOMException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.exception.BusinessException;

import java.io.IOException;
import org.xml.sax.SAXException;
import javax.xml.parsers.ParserConfigurationException;
import java.io.StringWriter;

/**
 * A proxy class for calling SUPS service methods.
 * 
 * @author Grant Miller
 *
 */
public abstract class AbstractSupsServiceProxy
{
    protected final static Class[] LOCAL_SERVICE_PARAM_TYPES = { String.class, StringWriter.class };
    protected final static Class[] REMOTE_SERVICE_PARAM_TYPES = { String.class, String.class, String.class }; 
    
    protected abstract String invoke(String jndiName, String methodName, String xmlParams) throws SystemException, BusinessException;
    
    /**
     * Invokes an EJB service returning a String. This method only works with the
     * Service style ejbs that take 3 arguments for their business methods.
     * 
     * @param jndiName The jndi name of the bean.
     * @param methodName The business method of the bean.
     * @param xmlParams The XML parameter structure.
     * @param bIncludeXMLHeader Should the returned string have "<?xml ...?>" included.
     * @return XML document as a string
     */
    public String getString(String jndiName, String methodName, String xmlParams, boolean bIncludeXMLHeader)
    	throws SystemException, BusinessException
    {
        try  {
            String s = invoke(jndiName, methodName, xmlParams);
            
            if ( !bIncludeXMLHeader && s.startsWith("<?xml") )
            {
            	// strip the header
            	s = s.substring( s.indexOf("?>\r\n")+4, s.length() );
            }
            
            return s;
        }
        catch(SystemException e){
        	throw e;
        }
        catch(BusinessException e){
        	throw e;
        }
        catch (Throwable e) {
        	// make sure all possible exceptions caught. None of the methods used above throw any
        	// explicit exception classes.
            throw new SystemException("Unexpected error while invoking service '"+jndiName+"."+methodName+"': "+e.getMessage(),e);
        }
    }
    
    /**
     * Invokes an EJB service returning a JDOM.  This method only works with the
     * Service style ejbs that take 3 arguments for their business methods.
     * 
     * @param jndiName The jndi name of the bean.
     * @param methodName The business method of the bean.
     * @param xmlParams The XML parameter structure.
     * @return XML document as a JDOM
     */
    public org.jdom.Document getJDOM(String jndiName, String methodName, String xmlParams)
    	throws SystemException,BusinessException
    {
        String s = getString(jndiName, methodName, xmlParams, true);
        	
        SAXBuilder builder = new SAXBuilder();
        org.jdom.Document doc = null;
        
        try {
        	doc = builder.build(new StringReader(s));
        }
        catch(IOException e) {
        	throw new SystemException("Failed to load results of service call '"+jndiName+"."+methodName+"': "+e.getMessage(),e);
        }
        catch(JDOMException e) {
        	throw new SystemException("Failed to process results of service call '"+jndiName+"."+methodName+"': "+e.getMessage(),e);
        }
        	
        return doc;
    }
    
    /**
     * Invokes an EJB service returning a W3C Node.  This method only works with the
     * Service style ejbs that take 3 arguments for their business methods.
     * 
     * @param jndiName The jndi name of the bean.
     * @param methodName The business method of the bean.
     * @param xmlParams The XML parameter structure.
     * @return Root node of W3C XML document.
     */
    public Node getNode(String jndiName, String methodName, String xmlParam)
		throws SystemException,BusinessException
    {
        String s = getString( jndiName, methodName, xmlParam, true);
        DocumentBuilderFactory fact = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        
        try { 
        	builder = fact.newDocumentBuilder();
    	}
        catch(ParserConfigurationException e) {
        	throw new SystemException("Failed to create parser: "+e.getMessage(),e);
        }
        
        Document doc = null;
        try {
        	doc = builder.parse(new InputSource(new StringReader(s)));
    	}
        catch(IOException e) {
        	throw new SystemException("Failed to load results of service call '"+jndiName+"."+methodName+"': "+e.getMessage(),e);
        }
        catch(SAXException e) {
        	throw new SystemException("Failed to process results of service call '"+jndiName+"."+methodName+"': "+e.getMessage(),e);
        }
        
        return doc.getDocumentElement();
    }
}
