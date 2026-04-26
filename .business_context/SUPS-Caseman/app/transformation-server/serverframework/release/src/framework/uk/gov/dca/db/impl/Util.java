/*
 * Created on 27-Jul-2004
 *
 */
package uk.gov.dca.db.impl;

import java.io.InputStream;

import org.xml.sax.InputSource;
import uk.gov.dca.db.exception.SystemException;

/**
 * @author Michael Barker
 *
 */
public class Util
{
    
    public static InputSource getInputSource(String resource, Object caller)
    	throws SystemException
    {
        InputStream is = getInputStream(resource, caller);
        
        return new InputSource(is);
    }
    
    /**
     * We try 2 ways to get the input stream. The first works in all cases except
     * when the code is run from Ant. In that case the second method will have 
     * to be used.
     * 
     * @param resource
     * @param caller
     * @return
     */
    public static InputStream getInputStream(String resource, Object caller)
    	throws SystemException
    {    	
    	InputStream is = null;
    	try {
    		is = Thread.currentThread().getContextClassLoader().getResourceAsStream(resource);
    	
    		if ( is == null ) {
    			is = caller.getClass().getClassLoader().getResourceAsStream(resource);
    		}
    	}
    	catch(Throwable e) {
    		// if loading a resource fails then it throws undeclared exceptions
    		throw new SystemException("Resource: " + resource + " cannot be found.  Deployment Error!");
    	}	
    		
    	if (is == null)
    	{
    		throw new SystemException("Resource: " + resource + " cannot be found.  Deployment Error!");
    	}
    		
        return is;
    	
    }
    
}
