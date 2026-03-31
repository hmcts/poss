/*
 * Created on Aug 11, 2005
 *
 */
package uk.gov.dca.db.pipeline;

import java.io.IOException;
import java.io.OutputStream;
import java.io.StringWriter;
import java.io.Writer;
import java.io.ByteArrayOutputStream;
import java.util.Map;

import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.db.SupsConstants;
import uk.gov.dca.db.content.ContentProxy;
import uk.gov.dca.db.content.Document;
import uk.gov.dca.db.content.DocumentManager;
import uk.gov.dca.db.content.ContentProxyFactory;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.queryengine.QueryEngineException;

/**
 * Returns a document from the store.
 * Configuration:
 * 
 * <DocumentService 	get="/params/param[@name='document-id']"
 * 						save="/params/param[@name='xml-document']">
 * 		<DocumentManager> doc manager id </DocumentManager>
 * 		<ContentStore> content store id </ContentStore>
 * </DocumentService>
 * 
 * 
 * @author GrantM
 *
 */
public class DocumentService extends AbstractComponent2 implements IGenerator 
{

	private String m_getXPath = null;
	private String m_saveXPath = null;
	private uk.gov.dca.db.content.DocumentManager m_docManager = null;
	private ContentProxyFactory m_contentStore = null;
	private String m_docManagerId = null;
	private String m_contentStoreId = null;
	private static final String XML_HEADER = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n";
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.AbstractComponent#process()
	 */
	protected void process() throws BusinessException, SystemException {
		org.jdom.Document parameters = (org.jdom.Document)this.m_inputData.getData(org.jdom.Document.class);
			
		// is this a get or a save?
		try {
			Element getElement = (Element)XPath.selectSingleNode(parameters, m_getXPath);
			if ( getElement != null ) {
				String documentId = getElement.getText();				
				//get document
				getDocument(Long.parseLong(documentId));
			}
			else {
				Element saveElement = (Element)XPath.selectSingleNode(parameters, m_saveXPath);
				if ( saveElement != null ) {
					saveDocument((Element)(saveElement.getContent().get(0)));
				}
				else {
					throw new BusinessException("Neither a get nor save document requested");
				}
			}
		}
		catch(JDOMException e) {
			throw new SystemException("Error processing input: "+e.getMessage(),e);
		}
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#validate(java.lang.String, uk.gov.dca.db.queryengine.QueryEngineErrorHandler, org.jdom.Element, java.util.Map)
	 */
	public void validate(String methodId, QueryEngineErrorHandler handler,
			Element processingInstructions, Map preloadCache)
			throws SystemException 
	{
		readProcessingInstructions(processingInstructions,preloadCache);
		validateConfig(methodId+": ",handler);
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#preloadCache(org.jdom.Element, java.util.Map)
	 */
	public void preloadCache(Element processingInstructions, Map preloadCache)
			throws SystemException {
		// nothing to preload
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#prepare(org.jdom.Element, java.util.Map)
	 */
	public void prepare(Element processingInstructions, Map preloadCache)
			throws SystemException 
	{
		readProcessingInstructions(processingInstructions,preloadCache);
		validateConfig("",null);
		
		m_docManager = (DocumentManager)preloadCache.get(m_docManagerId);
		m_contentStore = (ContentProxyFactory)preloadCache.get(m_contentStoreId);
		
		if ( m_docManager == null ) {
			throw new SystemException("Unable to find document manager with id: "+m_docManagerId);
		}
		
		if ( m_contentStore == null ) {
			throw new SystemException("Unable to find content store with id: "+m_contentStore);
		}
	}

	/**
	 * Method to initialise the class from the processing instructions.
	 *  
	 * @param processingInstructions
	 * @throws SystemException
	 */
	private void readProcessingInstructions(Element processingInstructions, Map preloadCache)
		throws SystemException
	{
		// read in config
		m_getXPath = processingInstructions.getAttributeValue("get");
		m_saveXPath = processingInstructions.getAttributeValue("save");
		m_docManagerId = processingInstructions.getChildText("DocumentManager");
		m_contentStoreId = processingInstructions.getChildText("ContentStore");
	}
	
	/**
	 * Validates the config of the object
	 * 
	 * @param msgPreface
	 * @param handler
	 */
	private void validateConfig(String msgPreface, QueryEngineErrorHandler handler) 
		throws ConfigurationException, QueryEngineException
	{
		if (m_getXPath == null || m_getXPath.length() == 0) {
			raiseError("No 'get' xpath for document id configured", handler);
		}
		if (m_getXPath == null || m_getXPath.length() == 0) {
			raiseError("No 'save' xpath for xml document configured", handler);
		}
		if (m_docManagerId == null || m_docManagerId.length() == 0) {
			raiseError("No document manager id configured", handler);
		}
		if (m_contentStoreId == null || m_contentStoreId.length() == 0) {
			raiseError("No content store id configured", handler);
		}	
	}
	/**
	 * Raise error as exeption or via validation error handler, as appropriate
	 * @param msg
	 * @param handler
	 * @throws ConfigurationException
	 * @throws QueryEngineException
	 */
	private void raiseError(String msg, QueryEngineErrorHandler handler) 
		throws ConfigurationException, QueryEngineException
	{
		if ( handler == null) 
		{
			throw new ConfigurationException(msg);
		}
		else
		{
			handler.raiseError(msg);
		}
	}
	
	private void getDocument(long documentId)
		throws BusinessException,SystemException
	{
		// try to fetch the document
		Document doc = m_docManager.load( documentId );
		if ( doc == null )
			throw new BusinessException("Unable to create document with id '"+documentId+"'");
		
		// now get the documents' content
		ContentProxy content = m_contentStore.load( doc.getContentStoreId() );
		if ( content == null )
			throw new BusinessException("Unable to load content for document with id '"+documentId+"'");

		// output doc
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		content.read(os);
		
		Writer writer = new StringWriter();
		try {
			writer.write(XML_HEADER);
			writer.write(os.toString(SupsConstants.DEFAULT_ENCODING));
		}
		catch(IOException e) {
			throw new SystemException("Failed to write output: "+e.getMessage(),e);
		}
		this.m_outputData.setData(writer, Writer.class);
	}
	
	private void saveDocument(Element document) throws BusinessException,SystemException
	{
		if (document == null ) {
			throw new BusinessException("No input document");
		}
		
		ContentProxy proxy = m_contentStore.create();
		proxy.open(ContentProxy.READ_WRITE_MODE);
        OutputStream out = proxy.getOutput();
        
        XMLOutputter outputter = new XMLOutputter();
        try {
        	outputter.output(document, out);
            out.flush();
            out.close();
        }
        catch(IOException e) {
        	throw new SystemException("Failed to write to content store: "+e.getMessage(),e);
        }
        
        Document doc = m_docManager.create( 
        		(String)m_context.getSystemItem(ComponentContext.USER_ID_KEY), 
        		(String)m_context.getSystemItem(ComponentContext.COURT_ID_KEY), 
				"XML", "text/xml", false, true,
				0, String.valueOf(proxy.getId()));
        
        Writer writer = new StringWriter();
		try {
			writer.write(XML_HEADER);
			writer.write("<Document>"+doc.getId()+"</Document>");
        }
        catch(IOException e) {
        	throw new SystemException("Failed to write to output: "+e.getMessage(),e);
        }
		this.m_outputData.setData(writer, Writer.class);
	}
}
