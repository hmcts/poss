/*
 * Created on 05-May-2005
 *
 */
package uk.gov.dca.test_project.cases_service.classes;

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;

/**
 * @author Michael Barker
 *
 */
public class BigResultProcessor extends AbstractCustomProcessor
{

    /* (non-Javadoc)
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer, org.apache.commons.logging.Log)
     */
    public void process(Document inputParameters, Writer output, Log log)
            throws BusinessException, SystemException
    {
        
        try
        {
            output.write("<Result>");
            
            for (int i = 0; i < 10000; i++)
            {
                output.write("<Value>");
                output.write(String.valueOf(i));
                output.write("</Value>");
            }
                
            output.write("</Result>");            
        }
        catch (IOException e)
        {
            throw new SystemException(e);
        }
        
    }

}
