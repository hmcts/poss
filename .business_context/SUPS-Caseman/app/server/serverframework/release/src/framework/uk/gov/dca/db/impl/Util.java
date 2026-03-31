/*
 * Created on 27-Jul-2004
 *
 */
package uk.gov.dca.db.impl;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;

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
    
    public static String getContentFromInputStream(URL destUrl, String encoding) 
    	throws SystemException
    {
    	try {
			
			HttpURLConnection con = (HttpURLConnection) destUrl
					.openConnection();

			con.setAllowUserInteraction(false);
			con.setDoInput(true);
			con.setDoOutput(true);
			con.setUseCaches(false);
			con.setRequestMethod("GET");
			con.connect();

			try {
				// this has to be done to force the errorStream to be generated
				return Util.readInputStream(128, con.getInputStream(), encoding);				
			} catch (IOException e) {				
				return Util.readInputStream(128, con.getErrorStream(), encoding);
			}
			finally{
				con.disconnect();
			}

		} catch (Exception e) {
			throw new SystemException("Unable to retrieve InputStream from URL.",e);
		}
    }
    
    public static String readInputStream(final int bufSize,
			final InputStream inputStream, final String encoding) throws UnsupportedEncodingException,
			IOException {
		if (inputStream != null && bufSize > 0) {
			final StringBuffer responseContent = new StringBuffer(bufSize);

			// prepare to read the content from the client as UTF-8
			final Reader reader = new InputStreamReader(inputStream, encoding);

			// read all the content into the buffer and append this to the content
			// see the comment above for why we read the buffer like this.
			char[] buf = new char[1024];
			int numRead = 0;
			while ((numRead = reader.read(buf)) != -1) {
				responseContent.append(buf, 0, numRead);
			}
			return responseContent.toString();
		}
		return "";
	}
}
