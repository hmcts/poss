/*
 * Created on 03-May-2005
 *
 */
package uk.gov.dca.db.async;

import org.jdom.JDOMException;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IGenerator;

import java.io.IOException;
import java.sql.SQLException;


/**
 * @author Michael Barker
 *
 */
public class AsyncStateGenerator extends AbstractAsyncComponent implements IGenerator
{
    
    /**
     * @see uk.gov.dca.db.pipeline.AbstractComponent#process()
     */
    protected void process() throws BusinessException, SystemException
    {
		try
		{
			long requestId = getRequestId();
						
			AsyncCommand cmd = acMgr.load(requestId);
			
			if (cmd.getState() == AsyncCommand.State.ERROR)
			{
			    ExceptionHolder eh = ExceptionHolder.create(cmd.getResponse());
			    Exception e = eh.getException();
			    if (e instanceof BusinessException)
			    {
			        throw (BusinessException) e;
			    }
			    else if (e instanceof SystemException)
			    {
			        throw (SystemException) e;
			    }
			    else
			    {
			        throw new SystemException("Invalid exception returned from aysnchronous request: " + e.getClass().getName(), e);
			    }
			}
	        AsyncCommandManager.AsyncStats stats = acMgr.getStats(cmd);
	        String destinationName = cmd.getDestination();
	        Destination destination = (Destination) preloadCache.get(destinationName);
	        long eta = stats.getEta(destination.getMaxPoolSize());			
			m_dataSink.write(cmd.getStateXML(eta));
		}
		catch (NumberFormatException e)
		{
    		throw new SystemException("Failed to get command state: "+e.getMessage(),e);		    
		}
		catch (IOException e)
		{
    		throw new SystemException("Failed to get command state: "+e.getMessage(),e);
		}
		catch (JDOMException e)
		{
    		throw new BusinessException("Failed to get command state: "+e.getMessage(),e);
		}
        catch (SQLException e)
        {
    		throw new SystemException("Failed to get command state: "+e.getMessage(),e);
        }
    }

}
