package uk.gov.dca.test_project.linked_service.classes;

import javax.naming.InitialContext;
import javax.naming.NamingException;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor2;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;

public class AsyncHack extends AbstractCustomProcessor2
{
    private final static String QCF = "jms/QueueConnectionFactory";

    public void process(ComponentInput inputParameters, ComponentInput output, Log log) throws BusinessException, SystemException
    {
        try
        {
            InitialContext ic = new InitialContext();
        }
        catch (NamingException e)
        {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
        
        output.setData("<Result/>", String.class);
        
    }
    
    
}
