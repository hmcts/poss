/*
 * Created on 10-May-2005
 *
 */
package uk.gov.dca.db.xslfo;

import java.io.IOException;
import java.io.OutputStream;
import java.io.StringReader;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.xml.transform.stream.StreamSource;

import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.SupsConstants;
import uk.gov.dca.db.content.ContentProxy;
import uk.gov.dca.db.content.ContentProxyFactory;
import uk.gov.dca.db.content.Document;
import uk.gov.dca.db.content.DocumentManager;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractComponent2;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.IGenerator;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.queryengine.QueryEngineException;

/**
 * @author Michael Barker
 *
 */
public class XSLFOComponent extends AbstractComponent2 implements IGenerator
{

    private String defaultName = null;
    private XPath namePath = null;
    private String xsl = null;
    private String method = null;
    private String service = null;
    private boolean isPersistent = false;
    private Map params = new HashMap();
    private SAXBuilder builder = new SAXBuilder();
    private ContentProxyFactory cFact;
    private XSLFOProcessorFactory xFact;
    private final static String MIME_TYPE = "application/pdf";
    private AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy();
    private DocumentManager dMgr;

    /**
     * @see uk.gov.dca.db.pipeline.AbstractComponent#process()
     */
    protected void process() throws BusinessException, SystemException
    {
        ContentProxy content = null;
        try
        {
            org.jdom.Document d = (org.jdom.Document)this.m_inputData.getData(org.jdom.Document.class);
			String inStr = (String)this.m_inputData.getData(String.class);
            
            String configName = namePath.valueOf(d);
            
            // Get the XSLFO processor
            // TODO: Cache this.
            XSLFOProcessor processor = xFact.create(xsl, params);
            
            // Get the source data.
            String data = proxy.getString("ejb/" + service + "ServiceLocal", method + "Local", inStr, true);
            
            // Get the content proxy.
            content = cFact.create();
            content.open(ContentProxy.READ_WRITE_MODE);
            
            // Do the processing.
            OutputStream out = content.getOutput();
            processor.process(new StreamSource(new StringReader(data)), out);
            out.flush();
            out.close();
            
            String userId = (String) getContext().getSystemItem(IComponentContext.USER_ID_KEY);
            String courtId = (String) getContext().getSystemItem(IComponentContext.COURT_ID_KEY);
//            String userId = XPath.newInstance(SupsConstants.USER_ID_PATH).valueOf(d);
//            String courtId = XPath.newInstance(SupsConstants.COURT_ID_PATH).valueOf(d);
            
            Document doc = dMgr.create(userId, courtId, configName, MIME_TYPE, false, false, Document.COMPLETE_STATE, content.getId());
            
            // Write the id back to the client.
            this.m_outputData.setData(
            	"<Document><Id>"+
				String.valueOf(doc.getId())+
				"</Id><MimeType>"+
				MIME_TYPE+
				"</MimeType>"+
            	"</Document>",
				String.class);
        }
        catch (JDOMException e)
        {
            throw new SystemException(e);
        }
        catch (IOException e)
        {
            throw new SystemException(e);
        }
        finally
        {
            if (content != null)
            {
                content.close();
            }
        }
    }

    /**
     * @see uk.gov.dca.db.pipeline.IComponent#validate(java.lang.String, uk.gov.dca.db.queryengine.QueryEngineErrorHandler, org.jdom.Element, java.util.Map)
     */
    public void validate(String methodId, QueryEngineErrorHandler handler,
            Element processingInstructions, Map preloadCache)
            throws SystemException
    {
        checkAttribute(processingInstructions, "namePath", handler);
        checkAttribute(processingInstructions, "xsl", handler);
        checkAttribute(processingInstructions, "service", handler);
        checkAttribute(processingInstructions, "method", handler);
        
        Collection params = processingInstructions.getChildren();
        for (Iterator j = params.iterator(); j.hasNext();)
        {
            Element param = (Element) j.next();
            checkAttribute(param, "name", handler);
            if (param.getText() == null || param.getText().length() == 0)
            {
                handler.raiseError("The text value for the parameter: " + param.getAttribute("name") + " is not specified");
            }
        }
    }
    
    private void checkAttribute(Element e, String name, QueryEngineErrorHandler handler) throws QueryEngineException, ConfigurationException
    {
        String value = e.getAttributeValue(name);
        if (value == null || value.length() == 0)
        {
            handler.raiseError("The attribute " + name + " is not specified");
        }
    }
    

    /* (non-Javadoc)
     * @see uk.gov.dca.db.pipeline.IComponent#preloadCache(org.jdom.Element, java.util.Map)
     */
    public void preloadCache(Element processingInstructions, Map preloadCache)
            throws SystemException
    {
        
    }

    /* (non-Javadoc)
     * @see uk.gov.dca.db.pipeline.IComponent#prepare(org.jdom.Element, java.util.Map)
     */
    public void prepare(Element processingInstructions, Map preloadCache)
            throws SystemException
    {
        try
        {
            cFact = (ContentProxyFactory) preloadCache.get(SupsConstants.CONTENT_STORE_ID);
            xFact = (XSLFOProcessorFactory) preloadCache.get(SupsConstants.XSLFO_FACTORY_ID);
            dMgr = (DocumentManager) preloadCache.get(SupsConstants.DOCUMENT_MANAGER_ID);
            namePath = XPath.newInstance(processingInstructions.getAttributeValue("namePath"));
            xsl = processingInstructions.getAttributeValue("xsl");
            service = processingInstructions.getAttributeValue("service");
            method = processingInstructions.getAttributeValue("method");
            isPersistent = new Boolean(processingInstructions.getAttributeValue("persistent")).booleanValue();
            
            Collection params = (Collection) processingInstructions.getChildren("Param");
            
            for (Iterator i = params.iterator(); i.hasNext();)
            {
                Element param = (Element) i.next();
                String pName = param.getAttributeValue("name");
                String pType = param.getAttributeValue("type");
                String pValue = param.getText();
                
                addParam(pName, pType, pValue);
            }
            
        }
        catch (JDOMException e)
        {
            throw new SystemException(e);
        }
    }
    
    
    public void addParam(String name, String type, String valueStr) throws SystemException
    {
        try
        {
            Class clazz = Thread.currentThread().getContextClassLoader().loadClass(type);
            Constructor cns = clazz.getConstructor(new Class[] { String.class });
            Object value = cns.newInstance(new Object[] { valueStr });
            params.put(name, value);
        }
        catch (SecurityException e1)
        {
            throw new SystemException(e1);
        }
        catch (IllegalArgumentException e1)
        {
            throw new SystemException(e1);
        }
        catch (ClassNotFoundException e1)
        {
            throw new SystemException(e1);
        }
        catch (NoSuchMethodException e1)
        {
            throw new SystemException(e1);
        }
        catch (InstantiationException e1)
        {
            throw new SystemException(e1);
        }
        catch (IllegalAccessException e1)
        {
            throw new SystemException(e1);
        }
        catch (InvocationTargetException e1)
        {
            throw new SystemException(e1);
        }
    }
}
