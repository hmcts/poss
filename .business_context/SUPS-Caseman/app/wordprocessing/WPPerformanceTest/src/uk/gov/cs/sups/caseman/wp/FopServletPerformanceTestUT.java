/*
 * Created on Nov 9, 2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.cs.sups.caseman.wp;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;

import org.xml.sax.SAXException;

import com.meterware.httpunit.GetMethodWebRequest;
import com.meterware.httpunit.WebConversation;
import com.meterware.httpunit.WebForm;
import com.meterware.httpunit.WebRequest;
import com.meterware.httpunit.WebResponse;

import junit.framework.TestCase;
/**
 * @author sz2n4g
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class FopServletPerformanceTestUT extends TestCase {
	int nextId = 0;
	public void testCJR190() {
		String type = "CJR190";
        WebConversation conversation = new WebConversation();
        WebRequest  request = new GetMethodWebRequest( "http://supsserver:8080/wp/FopPerformanceTest.jsp" );

        try {
    		String xml = getResourceString(type);
			WebResponse response = conversation.getResponse( request );
			WebForm form = response.getForms()[0];
			form.setParameter( "type", type);
			form.setParameter( "UniqueId", "WPPT" + nextId());
			form.setParameter( "xsl-f", "/Notice/" + type + "/" + type + "-FO.xsl");
			form.setParameter( "xml", xml);
			response = form.submit();
			assertEquals( "PDF not returned", "application/x-pdf", response.getContentType());
		} catch (MalformedURLException e) {
			fail(e.getMessage());
		} catch (IOException e) {
			fail(e.getMessage());
		} catch (SAXException e) {
			fail(e.getMessage());
		}
	}
	/**
	 * @param type
	 * @return
	 * @throws IOException
	 */
	private String getResourceString(String type) throws IOException {
		StringBuffer resourceString = new StringBuffer();
		char[] buffer = new char[1024];
		int charsRead = 0;
		BufferedReader reader = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream(type + ".xml")));
		while((charsRead = reader.read(buffer)) != -1) {
			resourceString.append(buffer, 0, charsRead);
		}
		return resourceString.toString();
	}
	/**
	 * @return The next unique id.
	 */
	private synchronized String nextId() {
		return "" + nextId++;
	}
}
