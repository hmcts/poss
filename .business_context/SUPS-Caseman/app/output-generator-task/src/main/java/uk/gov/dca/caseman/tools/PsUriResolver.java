package uk.gov.dca.caseman.tools;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import javax.xml.transform.Source;
import javax.xml.transform.TransformerException;
import javax.xml.transform.URIResolver;
import javax.xml.transform.stream.StreamSource;

/**
 * @author sz2n4g
 */
public class PsUriResolver implements URIResolver {

    /**
     * @see javax.xml.transform.URIResolver#resolve(java.lang.String, java.lang.String)
     */
    public Source resolve(String href, String base) throws TransformerException {
        Source source = null;
        String entityPath;
        if (href.endsWith("supsfo.xsl")) {
            entityPath = "file:\\" + href.substring(0, href.indexOf("supsfo.xsl")) + "supsfops.xsl";
        } else {
            entityPath = "file:\\" + href;
        }
        try {
            URL url = new URL(entityPath);
            source = new StreamSource(url.openStream());
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return source;
    }

}
