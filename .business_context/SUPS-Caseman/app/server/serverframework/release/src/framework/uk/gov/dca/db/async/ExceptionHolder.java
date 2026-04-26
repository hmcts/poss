/*
 * Created on 04-May-2005
 *
 */
package uk.gov.dca.db.async;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.XMLOutputter;

import java.io.IOException;
import java.io.StringReader;
import java.lang.reflect.Constructor;

/**
 * @author Michael Barker
 *
 */
public class ExceptionHolder
{
    private Class exClass;
    private String message;

    public ExceptionHolder(Class exClass, String message)
    {
        this.exClass = exClass;
        this.message = message;
    }
    
    /**
     * Get the XML representing this exception.
     * 
     * @return
     */
    public String getXML()
    {
        Element e = new Element("exception");
        e.setAttribute("class", exClass.getName());
        e.setText(message);
        XMLOutputter out = new XMLOutputter();
        return out.outputString(e);
    }
    
    /**
     * Gets an exception object that may be thrown.
     * 
     * @return
     */
    public Exception getException()
    {
        try
        {
            Constructor cns = exClass.getConstructor(new Class[] { String.class });
            Exception ex = (Exception) cns.newInstance(new Object[] { message });
            return ex;
        }
        catch (Exception e)
        {
            throw new RuntimeException("Unable to Construction Exception: " + exClass.getName(), e);
        }
    }
    
    /**
     * Creates an exception holder from its XML represntation.
     * 
     * @param xml
     * @return
     * @throws JDOMException
     * @throws IOException
     */
    public final static ExceptionHolder create(String xml) throws JDOMException, IOException
    {
        SAXBuilder b = new SAXBuilder();
        Document d = b.build(new StringReader(xml));
        String className = d.getRootElement().getAttributeValue("class");
        String message = d.getRootElement().getText();
        
        return create(className, message);
    }
    
    /**
     * Creates an exception from exception class name and a message.
     * 
     * @param className
     * @param message
     * @return
     */
    public final static ExceptionHolder create(String className, String message)
    {
        try
        {
            Class exClass = Thread.currentThread().getContextClassLoader().loadClass(className);
            return new ExceptionHolder(exClass, message);
        }
        catch (ClassNotFoundException e)
        {
            throw new RuntimeException("Unable to find exception class: " + className);
        }
    }
}
