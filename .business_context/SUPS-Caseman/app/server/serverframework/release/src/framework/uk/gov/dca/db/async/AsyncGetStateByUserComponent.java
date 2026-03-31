/*
 * Created on 17-May-2005
 *
 */
package uk.gov.dca.db.async;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.io.Writer;
import java.io.StringWriter;

import javax.sql.DataSource;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.SupsConstants;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractComponent2;
import uk.gov.dca.db.pipeline.IGenerator;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;

/**
 * @author Michael Barker
 *
 */
public class AsyncGetStateByUserComponent extends AbstractComponent2 implements IGenerator
{
    protected AsyncCommandManager acMgr;

    /**
     * @see uk.gov.dca.db.pipeline.AbstractComponent#process()
     */
    protected void process() throws BusinessException, SystemException
    {
    	Document d = (Document)this.m_inputData.getData(Document.class);
         
        try
        {
            String userId = XPath.newInstance(SupsConstants.USER_ID_PATH).valueOf(d);
            Collection c = acMgr.findByUser(userId);
            
            Writer outputSink = new StringWriter();
            this.m_outputData.setData(outputSink, Writer.class);
            
            outputSink.write("<AsyncList>");
            
            for (Iterator i = c.iterator(); i.hasNext();)
            {
                AsyncCommand ac = (AsyncCommand) i.next();
                // Note the eta value at this point is incorrect.
                // When getting a list of values we will not bother
                // only when an individual item is requested.
                outputSink.write(ac.getStateXML(42));
            }
            outputSink.write("</AsyncList>");
        }
        catch (JDOMException e)
        {
            throw new SystemException(e);
        }
        catch (IOException e)
        {
            throw new SystemException(e);
        }
    }

    /**
     * @see uk.gov.dca.db.pipeline.IComponent#validate(java.lang.String, uk.gov.dca.db.queryengine.QueryEngineErrorHandler, org.jdom.Element, java.util.Map)
     */
    public void validate(String methodId, QueryEngineErrorHandler handler,
            Element processingInstructions, Map preloadCache)
            throws SystemException
    {
    }

    /**
     * @see uk.gov.dca.db.pipeline.IComponent#preloadCache(org.jdom.Element, java.util.Map)
     */
    public void preloadCache(Element processingInstructions, Map preloadCache)
            throws SystemException
    {
    }

    /**
     * @see uk.gov.dca.db.pipeline.IComponent#prepare(org.jdom.Element, java.util.Map)
     */
    public void prepare(Element processingInstructions, Map preloadCache)
            throws SystemException
    {
        DataSource ds = (DataSource) preloadCache.get(AsyncCommand.ASYNC_DS);
        acMgr = new AsyncCommandManager(ds);
    }

}
