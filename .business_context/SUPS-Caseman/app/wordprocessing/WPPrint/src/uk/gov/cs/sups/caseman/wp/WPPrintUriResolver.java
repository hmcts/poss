package uk.gov.cs.sups.caseman.wp;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.UnknownHostException;

import javax.xml.transform.Source;
import javax.xml.transform.URIResolver;
import javax.xml.transform.TransformerException;
import javax.xml.transform.stream.StreamSource;

/**
 * Custom URI resolver to allow XSL files to be loaded from within
 * the jar file as InputStreams.
 * @author Nick Wilson
 * @version WP-1.13
 */
public class WPPrintUriResolver implements URIResolver {
    private String context = "casemanwp";
    private String absoluteUrl;
	
    public WPPrintUriResolver() {
        try {
            InetAddress thisIp = InetAddress.getLocalHost();
            absoluteUrl = "http://" + thisIp.getHostAddress() + ":8080/";
        } catch (UnknownHostException e) {
            absoluteUrl = "http://localhost:8080/";
        }
    }
    
	/**
     * Resolves the given URI to a Source object using the following rules<br>
     * If the href String contains the context string to be searched for, the href is
     * assumed to be an HTTP address and the portion of the string after the context is
     * used as the location of the required file within the WordProcessing jar file.<br>
     * If the href String does not contain the context, it remains unchanged and is used
     * as the location of the required file within the WordProcessing jar file.<br>
     * The base String is not used.
	 * @see javax.xml.transform.URIResolver#resolve(java.lang.String, java.lang.String)
	 */
	public Source resolve(String href, String base) throws TransformerException {
		Source source = null;
		int start = href.indexOf(context);
		if (start != -1) {
			String relativeUrl = href.substring(start, href.length());
            String entityPath;
            if (relativeUrl.endsWith("supsfo.xsl")) {
                entityPath = absoluteUrl + relativeUrl.substring(0, relativeUrl.indexOf("supsfo.xsl")) + "supsfops.xsl";
            } else {
				entityPath = absoluteUrl + relativeUrl;
            }
			try {
				//log.debug("Resolving to " + entityPath);
				URL url = new URL(entityPath);
				source = new StreamSource(url.openStream());
			} catch (MalformedURLException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		} else {
			String entityPath = href;
			InputStream istream = getClass().getResourceAsStream(entityPath);
			source = new StreamSource(istream);
		}
		return source;
	}

    /**
     * @param localAddr
     */
    public void setHost(String localAddr) {
        absoluteUrl = "http://" + localAddr + ":8080/";
    }
}
