/*
 * Created on 10-May-2005
 *
 */
package uk.gov.dca.db.xslfo;

import java.io.InputStream;
import java.util.Map;

import javax.xml.transform.Source;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author Michael Barker
 *
 */
public interface XSLFOProcessorFactory
{
    public XSLFOProcessor create(Source src, Map param) throws SystemException;
    public XSLFOProcessor create(String resourceName, Map param) throws SystemException;
    public XSLFOProcessor create(InputStream in, Map param) throws SystemException;
}
