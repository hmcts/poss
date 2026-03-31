/*
 * Created on 10-May-2005
 *
 */
package uk.gov.dca.db.xslfo.fop;

import java.io.OutputStream;
import java.util.Iterator;
import java.util.Map;

import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.sax.SAXResult;

import org.apache.commons.logging.Log;
import org.apache.fop.apps.Driver;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.Assert;
import uk.gov.dca.db.util.SUPSLogFactory;
import uk.gov.dca.db.xslfo.XSLFOException;
import uk.gov.dca.db.xslfo.XSLFOProcessor;

/**
 * @author Michael Barker
 *
 */
public class FOPProcessor implements XSLFOProcessor
{
    Log log = SUPSLogFactory.getLogger(FOPProcessor.class);
    
    Transformer trans;
    Driver driver;

    /**
     * @param src
     * @param params
     * @throws TransformerConfigurationException
     */
    public FOPProcessor(Source src, Map params) throws TransformerConfigurationException
    {
        driver = new Driver();
        driver.setRenderer(Driver.RENDER_PDF);
        TransformerFactory fact = TransformerFactory.newInstance();
        trans = fact.newTransformer(src);
        trans.setParameter("versionParam", "2.0");
        for (Iterator i = params.keySet().iterator(); i.hasNext();)
        {
        	Object key = i.next();
        	Object value = params.get(key);
        	trans.setParameter(key.toString(), value);
        	log.debug("Setting parameter for transfomer " + key + ": " + value);
        }        
    }

    /**
     * @throws SystemException
     * @see uk.gov.dca.db.xslfo.FOProcessor#process(javax.xml.transform.Source, javax.xml.transform.Result)
     */
    public void process(Source src, OutputStream out) throws SystemException
    {
        Assert.assertTrue(src != null, log, "XSLT Data Source is null");
        Assert.assertTrue(src != null, log, "XSLT Output Stream is null");
        
        try
        {
            driver.setOutputStream(out);
            trans.transform(src, new SAXResult(driver.getContentHandler()));
        }
        catch (TransformerException e)
        {
            throw new XSLFOException(e);
        }
    }

}
