/*
 * Created on 16-May-2005
 *
 */
package uk.gov.dca.db.async;

import java.io.IOException;
import java.sql.SQLException;

import org.jdom.JDOMException;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IGenerator;

/**
 * @author Michael Barker
 *
 */
public class AsyncCancelComponent extends AbstractAsyncComponent implements IGenerator
{

    /**
     * @see uk.gov.dca.db.pipeline.AbstractComponent#process()
     */
    protected void process() throws BusinessException, SystemException
    {
        try
        {
            long requestId = getRequestId();
            acMgr.cancel(requestId);
            AsyncCommand cmd = acMgr.load(requestId);
			m_dataSink.write(cmd.getStateXML(0));            
        }
        catch (JDOMException e)
        {
            throw new SystemException(e);
        }
        catch (IOException e)
        {
            throw new SystemException(e);
        }
        catch (SQLException e)
        {
            throw new SystemException(e);
        }
    }

}
