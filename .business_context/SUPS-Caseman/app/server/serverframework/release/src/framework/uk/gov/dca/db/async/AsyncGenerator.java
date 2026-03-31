                                                                  /*
 * Created on 19-Apr-2005
 *
 */
package uk.gov.dca.db.async;

import java.net.InetAddress;
import java.util.Map;
import java.util.Properties;

import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.jdom.Element;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractComponent2;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.IGenerator;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.util.Assert;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Framework component to do asynchronous invocation of other services.
 * 
 * @author Michael Barker
 *
 */
public class AsyncGenerator extends AbstractComponent2 implements IGenerator
{
    private final static Log log = SUPSLogFactory.getLogger(AsyncGenerator.class);
    private final static String HOST_KEY = "uk.gov.dca.db.AsyncGenerator.host";
    private String serviceName;
    private String methodName;
    private Destination destination;
    private AsyncCommandManager acMgr;
    private String host;
    private String newTx;
    
    /**
     * @see uk.gov.dca.db.pipeline.AbstractComponent#process()
     */
    protected void process() throws BusinessException, SystemException
    {
        Assert.assertTrue(serviceName != null, log, "serviceName is not sepecified");
        Assert.assertTrue(methodName  != null, log, "methodName is not sepecified");
        Assert.assertTrue(destination != null, log, "destination is not sepecified");
        
        String request = (String)this.m_inputData.getData(String.class);
       
        String userId = (String) m_context.getSystemItem(IComponentContext.USER_ID_KEY);
        String courtId = (String) m_context.getSystemItem(IComponentContext.COURT_ID_KEY);
        
        AsyncCommand cmd = acMgr.create(userId, courtId, host, serviceName, methodName, destination.getId(), AsyncCommand.RequestType.DOCUMENT, request);
        Properties p = new Properties();
        p.setProperty(AsyncCommand.NEW_TX, newTx);
        destination.send(cmd, p, QueueHandler.OBJECT_MESSAGE);
        
        log.info("Sent request service: " + serviceName + " method: " + methodName);
    
        AsyncCommandManager.AsyncStats stats = acMgr.getStats(cmd);
        long eta = stats.getEta(destination.getMaxPoolSize());			

        this.m_outputData.setData( cmd.getStateXML(eta), String.class );
    }

    /**
     * @see uk.gov.dca.db.pipeline.IComponent#validate(java.lang.String, uk.gov.dca.db.queryengine.QueryEngineErrorHandler, org.jdom.Element, java.util.Map)
     */
    public void validate(String methodId, QueryEngineErrorHandler handler, Element processingInstructions, Map preloadCache) throws SystemException
    {
        load(processingInstructions, preloadCache);
    }

    /* (non-Javadoc)
     * @see uk.gov.dca.db.pipeline.IComponent#preloadCache(org.jdom.Element, java.util.Map)
     */
    public void preloadCache(Element processingInstructions, Map preloadCache) throws SystemException
    {
        try
        {
            InetAddress ia = InetAddress.getLocalHost();
            preloadCache.put(HOST_KEY, ia.getHostAddress());
        }
        catch (Exception e)
        {
            log.warn("Unable to determine local host name: " + e.getMessage());
            preloadCache.put(HOST_KEY, "Unknown");
        }
    }

    /* (non-Javadoc)
     * @see uk.gov.dca.db.pipeline.IComponent#prepare(org.jdom.Element, java.util.Map)
     */
    public void prepare(Element processingInstructions, Map preloadCache) throws SystemException
    {
        load(processingInstructions, preloadCache);
        DataSource ds = (DataSource) preloadCache.get(AsyncCommand.ASYNC_DS);
        acMgr = new AsyncCommandManager(ds);
    }
    
    /**
     * Loads the processing instructions into this instance.
     * 
     * @param processingInstructions
     */
    public void load(Element processingInstructions, Map preloadCache)
    {
        serviceName = processingInstructions.getAttributeValue("service");
        methodName = processingInstructions.getAttributeValue("method");
        newTx = processingInstructions.getAttributeValue("newTx");
        if (newTx == null)
        {
            newTx = "true";
        }
        String name = processingInstructions.getChild("Destination").getAttributeValue("name");
        destination = (Destination) preloadCache.get(name);
        host = (String) preloadCache.get(HOST_KEY);
    }

}
