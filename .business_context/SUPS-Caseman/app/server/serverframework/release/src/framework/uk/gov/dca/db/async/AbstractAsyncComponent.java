/*
 * Created on 16-May-2005
 *
 */
package uk.gov.dca.db.async;

import java.io.IOException;
import java.io.StringReader;
import java.util.Map;

import javax.sql.DataSource;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractComponent;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;

/**
 * @author Michael Barker
 *
 */
public abstract class AbstractAsyncComponent extends AbstractComponent
{
    protected XPath idPath = null;
    protected AsyncCommandManager acMgr;
	protected SAXBuilder builder = new SAXBuilder();
	protected Map preloadCache;

    protected long getRequestId() throws JDOMException, IOException
    {
		String sInput = m_dataSrc.toString();
		Document parameters = builder.build(new StringReader(sInput));
		return idPath.numberValueOf(parameters).longValue();
    }
    
    
    /**
     * @see uk.gov.dca.db.pipeline.IComponent#validate(java.lang.String, uk.gov.dca.db.queryengine.QueryEngineErrorHandler, org.jdom.Element, java.util.Map)
     */
    public void validate(String methodId, QueryEngineErrorHandler handler, Element processingInstructions, Map preloadCache) throws SystemException
    {
        String idPath = processingInstructions.getAttributeValue("idPath");
        if (idPath == null)
        {
            handler.raiseError("idPath has not been specified");
        }
    }

    /**
     * @see uk.gov.dca.db.pipeline.IComponent#preloadCache(org.jdom.Element, java.util.Map)
     */
    public void preloadCache(Element processingInstructions, Map preloadCache) throws SystemException
    {
    }

    /**
     * @see uk.gov.dca.db.pipeline.IComponent#prepare(org.jdom.Element, java.util.Map)
     */
    public void prepare(Element processingInstructions, Map preloadCache) throws SystemException
    {
        this.preloadCache = preloadCache;
        DataSource ds = (DataSource) preloadCache.get(AsyncCommand.ASYNC_DS);
        acMgr = new AsyncCommandManager(ds);
        try
        {
            idPath = XPath.newInstance(processingInstructions.getAttributeValue("idPath"));
        }
        catch (JDOMException e)
        {
            throw new SystemException(e);
        }
    }

}
