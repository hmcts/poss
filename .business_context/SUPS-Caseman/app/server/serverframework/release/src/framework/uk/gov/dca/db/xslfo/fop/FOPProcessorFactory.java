/*
 * Created on 10-May-2005
 *
 */
package uk.gov.dca.db.xslfo.fop;

import java.io.InputStream;
import java.util.Map;

import javax.xml.transform.Source;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.stream.StreamSource;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;
import uk.gov.dca.db.xslfo.XSLFOException;
import uk.gov.dca.db.xslfo.XSLFOProcessor;
import uk.gov.dca.db.xslfo.XSLFOProcessorFactory;

/**
 * @author Michael Barker
 *
 */
public class FOPProcessorFactory implements XSLFOProcessorFactory
{

    /**
     * @see uk.gov.dca.db.xslfo.XSLFOProcessorFactory#create(javax.xml.transform.Source)
     */
    public XSLFOProcessor create(Source src, Map params) throws SystemException
    {
        try
        {
            return new FOPProcessor(src, params);            
        }
        catch (TransformerConfigurationException e)
        {
            throw new XSLFOException(e);
        }
    }

    /**
     * @see uk.gov.dca.db.xslfo.XSLFOProcessorFactory#create(java.lang.String)
     */
    public XSLFOProcessor create(String resourceName, Map params) throws SystemException
    {
        return create(Util.getInputStream(resourceName, this), params);
    }

    /**
     * @see uk.gov.dca.db.xslfo.XSLFOProcessorFactory#create(java.io.InputStream)
     */
    public XSLFOProcessor create(InputStream in, Map params) throws SystemException
    {
        return create(new StreamSource(in), params);
    }
    
}
