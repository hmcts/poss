package uk.gov.dca.caseman.tools;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import javax.xml.transform.Source;
import javax.xml.transform.URIResolver;
import javax.xml.transform.TransformerException;
import javax.xml.transform.stream.StreamSource;

import org.apache.avalon.framework.logger.ConsoleLogger;
import org.apache.avalon.framework.logger.Logger;

/**
 * Custom URI resolver to allow XSL files to be loaded from within
 * the jar file as InputStreams.
 * @author Nick Wilson
 * @version WP-1.13
 */
public class WPUriResolver implements URIResolver {
    /** Logger for handling log messages. */
    private Logger log = null;
    /** The context for which to resolve URIs. */
    private String context = "supsfo.xsl";
	
	/**
     * Constructor to set up the Logger.
	 */
    public WPUriResolver() {
        if (log == null)
        {
            log = new ConsoleLogger(ConsoleLogger.LEVEL_DEBUG);
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
		log.debug("Resolving " + href);
		int start = href.indexOf(context);
		if (start != -1) 
		{																
				String entityPath = href.substring(0, start) + "supsfo_templatedocumentation.xsl";
				log.debug("Resolving to " + entityPath);
				try
				{
					FileInputStream istream = new FileInputStream(entityPath);	

					log.debug("istream="+istream);
					source = new StreamSource(istream);
				}
				catch(FileNotFoundException fnfExcp)
				{
					log.error("file not found:"+entityPath, fnfExcp);
				}
				catch(Exception fnfExcp)
				{
					log.error("exception:"+entityPath, fnfExcp);
				}
			
		} 
		else 
		{
			String entityPath = href;
			log.debug("(non)Resolving to " + entityPath);
			log.debug("getClass()="+getClass());
			try
			{
				FileInputStream istream = new FileInputStream(entityPath);	

				log.debug("istream="+istream);
				source = new StreamSource(istream);
			}
			catch(FileNotFoundException fnfExcp)
			{
				log.error("file not found:"+entityPath, fnfExcp);
			}
			catch(Exception fnfExcp)
			{
				log.error("exception:"+entityPath, fnfExcp);
			}
			
		}
		return source;
	}
}
