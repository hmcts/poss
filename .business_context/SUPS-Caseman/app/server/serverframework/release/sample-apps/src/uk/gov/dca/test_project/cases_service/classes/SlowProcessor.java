package uk.gov.dca.test_project.cases_service.classes;

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.JDOMException;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;

public class SlowProcessor extends AbstractCustomProcessor
{

    public void process(Document inputParameters, Writer output, Log log) throws BusinessException, SystemException
    {
        try
        {
            long sleepTime = XPath.newInstance("/params/param[@name='sleep']").numberValueOf(inputParameters).longValue();
            
            for (int i = 0; i < 10; i++)
            {
                try
                {
                    System.out.println("Sleeping: " + i + "/10");
                    Thread.sleep(sleepTime / 10);
                }
                catch (InterruptedException e)
                {
                    // Allow process to continue.
                }                
            }
            
            System.out.println("Complete");
            
            new XMLOutputter().output(inputParameters.getRootElement(), output);
        }
        catch (IOException e)
        {
            throw new SystemException(e);
        }
        catch (JDOMException e)
        {
            throw new SystemException(e);
        }
        
    }
    
}
