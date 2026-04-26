/*
 * Created on 10-May-2005
 *
 */
package uk.gov.dca.db.xslfo;

import java.io.OutputStream;

import javax.xml.transform.Source;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author Michael Barker
 *
 */
public interface XSLFOProcessor
{
    public void process(Source src, OutputStream out) throws SystemException;
}
