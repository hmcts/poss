/*
 * Created on 30-Jul-2004
 *
 */
package uk.gov.dca.db.xslt;

import java.io.FileNotFoundException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import java.io.Writer;
import javax.xml.transform.sax.SAXSource;
import org.xml.sax.InputSource;

/**
 * @author Michael Barker
 *
 */
public class SUPSTransformer
{
    public void transform(InputSource xsltSource, InputSource xmlSource, Writer out ) throws FileNotFoundException, TransformerException
    {    
        SAXSource xsltSAX = new SAXSource(xsltSource);
		SAXSource xmlSAX = new SAXSource(xmlSource);

		transform(xsltSAX,xmlSAX,out);
    }
    
    public void transform(SAXSource xsltSource, SAXSource xmlSource, Writer out ) throws TransformerException
    {    
		TransformerFactory tFactory = TransformerFactory.newInstance();
        Transformer transformer = tFactory.newTransformer(xsltSource);
    	
    	StreamResult srOut = new StreamResult(out);
    	transformer.transform(xmlSource, srOut);
    }
}
