/*
 * Created on 10-Jan-2005
 *
 */
package uk.gov.dca.test_project.cases_service.classes;

import java.util.Map;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.io.StringReader;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.output.XMLOutputter;
import org.jdom.input.SAXBuilder;
import org.jdom.JDOMException;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractComponent;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.IGenerator;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;

/**
 * A class used to test the use of the component 'context'
 * 
 * @author GrantM
 *
 */
public class ContextTestComponent extends AbstractComponent implements IGenerator {

	private final static String PRELOAD_CACHE_CONTEXT = "preload_context";
	private final static String PREPARE_CONTEXT = "prepare_context";
	private final static String TEST_USER_ITEM = "TEST_USER_ITEM";
	
	private Map m_preloadCache = null;
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.AbstractComponent#process()
	 */
	protected void process() throws BusinessException, SystemException {
		// outputs (as XML) contents of the following context objects:
		// - preload
		// - prepare
		// - process (i.e. current)
		try {
			IComponentContext preloadContext = (IComponentContext)m_preloadCache.get(PRELOAD_CACHE_CONTEXT+":"+m_context.getSystemItem(IComponentContext.METHOD_NAME_KEY));
			IComponentContext prepareContext = (IComponentContext)m_preloadCache.get(PREPARE_CONTEXT);

			String params = (String)m_context.getSystemItem(IComponentContext.REQUEST_PARAMETERS_KEY);
	   		/*Document parametersDoc = (Document)this.m_inputData.getData(Document.class);
	   			
	   		Writer outputWriter = new StringWriter();
	   		XMLOutputter xmlOutputter = new XMLOutputter();
	   		
	   		outputWriter.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
	   		outputWriter.write("<Contexts>\r\n");
			
	   		outputWriter.write("  <PreloadContext>\r\n");
	   		outputWriter.write("    <SystemContext>\r\n");
	   		outputWriter.write("      <ServiceName>"+preloadContext.getSystemItem(IComponentContext.SERVICE_NAME_KEY)+"</ServiceName>\r\n");
	   		outputWriter.write("      <MethodName>"+preloadContext.getSystemItem(IComponentContext.METHOD_NAME_KEY)+"</MethodName>\r\n");
	   		outputWriter.write("    </SystemContext>\r\n");
	   		outputWriter.write("  </PreloadContext>\r\n");
			
	   		outputWriter.write("  <PrepareContext>\r\n");
	   		outputWriter.write("    <SystemContext>\r\n");
	   		outputWriter.write("      <ServiceName>"+prepareContext.getSystemItem(IComponentContext.SERVICE_NAME_KEY)+"</ServiceName>\r\n");
	   		outputWriter.write("      <MethodName>"+prepareContext.getSystemItem(IComponentContext.METHOD_NAME_KEY)+"</MethodName>\r\n");
	   		outputWriter.write("    </SystemContext>\r\n");
	   		outputWriter.write("    <UserContext>\r\n");
	   		outputWriter.write("      <TestUserItem>"+prepareContext.getUserItem(TEST_USER_ITEM)+"</TestUserItem>\r\n");
	   		outputWriter.write("    </UserContext>\r\n");
	   		outputWriter.write("  </PrepareContext>\r\n");
			
	   		outputWriter.write("  <ProcessContext>\r\n");
			outputWriter.write("    <SystemContext>\r\n");
			outputWriter.write("      <ServiceName>"+m_context.getSystemItem(IComponentContext.SERVICE_NAME_KEY)+"</ServiceName>\r\n");
			outputWriter.write("      <MethodName>"+m_context.getSystemItem(IComponentContext.METHOD_NAME_KEY)+"</MethodName>\r\n");
			outputWriter.write("      <RequestParameters>"+xmlOutputter.outputString(parametersDoc.getRootElement())+"</RequestParameters>\r\n");
			outputWriter.write("    </SystemContext>\r\n");
			outputWriter.write("    <UserContext>\r\n");
			outputWriter.write("      <TestUserItem>"+m_context.getUserItem(TEST_USER_ITEM)+"</TestUserItem>\r\n");
			outputWriter.write("    </UserContext>\r\n");
			outputWriter.write("  </ProcessContext>\r\n");
			
			outputWriter.write("</Contexts>");
			
			this.m_outputData.setData(outputWriter, Writer.class);*/
			SAXBuilder builder = new SAXBuilder();
	   		Document parametersDoc = null;
	    	try {
	    		parametersDoc = builder.build( new StringReader(params) );
	    	}
	    	catch( IOException e ) {
	    		throw new SystemException("Unable to read context parameters: "+e.getMessage(),e);
	    	}
	    	catch( JDOMException e ) {
	    		throw new BusinessException("Failed to process context parameters: "+e.getMessage(),e);
	    	}
			XMLOutputter outputter = new XMLOutputter();
	    	
    		m_dataSink.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
			this.m_dataSink.write("<Contexts>\r\n");
			
			this.m_dataSink.write("  <PreloadContext>\r\n");
			this.m_dataSink.write("    <SystemContext>\r\n");
			this.m_dataSink.write("      <ServiceName>"+preloadContext.getSystemItem(IComponentContext.SERVICE_NAME_KEY)+"</ServiceName>\r\n");
			this.m_dataSink.write("      <MethodName>"+preloadContext.getSystemItem(IComponentContext.METHOD_NAME_KEY)+"</MethodName>\r\n");
			this.m_dataSink.write("    </SystemContext>\r\n");
			this.m_dataSink.write("  </PreloadContext>\r\n");
			
			this.m_dataSink.write("  <PrepareContext>\r\n");
			this.m_dataSink.write("    <SystemContext>\r\n");
			this.m_dataSink.write("      <ServiceName>"+prepareContext.getSystemItem(IComponentContext.SERVICE_NAME_KEY)+"</ServiceName>\r\n");
			this.m_dataSink.write("      <MethodName>"+prepareContext.getSystemItem(IComponentContext.METHOD_NAME_KEY)+"</MethodName>\r\n");
			this.m_dataSink.write("    </SystemContext>\r\n");
			this.m_dataSink.write("    <UserContext>\r\n");
			this.m_dataSink.write("      <TestUserItem>"+prepareContext.getUserItem(TEST_USER_ITEM)+"</TestUserItem>\r\n");
			this.m_dataSink.write("    </UserContext>\r\n");
			this.m_dataSink.write("  </PrepareContext>\r\n");
			
			this.m_dataSink.write("  <ProcessContext>\r\n");
			this.m_dataSink.write("    <SystemContext>\r\n");
			this.m_dataSink.write("      <ServiceName>"+m_context.getSystemItem(IComponentContext.SERVICE_NAME_KEY)+"</ServiceName>\r\n");
			this.m_dataSink.write("      <MethodName>"+m_context.getSystemItem(IComponentContext.METHOD_NAME_KEY)+"</MethodName>\r\n");
			this.m_dataSink.write("      <RequestParameters>"+outputter.outputString(parametersDoc.getRootElement())+"</RequestParameters>\r\n");
			this.m_dataSink.write("    </SystemContext>\r\n");
			this.m_dataSink.write("    <UserContext>\r\n");
			this.m_dataSink.write("      <TestUserItem>"+m_context.getUserItem(TEST_USER_ITEM)+"</TestUserItem>\r\n");
			this.m_dataSink.write("    </UserContext>\r\n");
			this.m_dataSink.write("  </ProcessContext>\r\n");
			
			this.m_dataSink.write("</Contexts>");
		}
		catch(IOException e) {
			throw new SystemException("Error writing out context data: "+e.getMessage(),e);
		}
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#validate(java.lang.String, uk.gov.dca.db.queryengine.QueryEngineErrorHandler, org.jdom.Element, java.util.Map)
	 */
	public void validate(String methodId, QueryEngineErrorHandler handler,
			Element processingInstructions, Map preloadCache)
			throws SystemException {
		// TODO Auto-generated method stub

	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#preloadCache(org.jdom.Element, java.util.Map)
	 */
	public void preloadCache(Element processingInstructions, Map preloadCache)
			throws SystemException {
		// uses preloadCache to store a reference to the context passed at preload time
		// NOTE: the preloadCache should not be used like this! (normally)
		preloadCache.put( PRELOAD_CACHE_CONTEXT+":"+m_context.getSystemItem(IComponentContext.METHOD_NAME_KEY), m_context );
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#prepare(org.jdom.Element, java.util.Map)
	 */
	public void prepare(Element processingInstructions, Map preloadCache)
			throws SystemException {
		// uses preloadCache to store a reference to the context passed at prepare time
		// NOTE: the preloadCache should not be used like this! (normally)
		preloadCache.put( PREPARE_CONTEXT, m_context );
		
		// test use of user context items
		m_context.putUserItem(TEST_USER_ITEM, TEST_USER_ITEM);
		
		// make sure can get to preload cache when process
		m_preloadCache = preloadCache;
	}
}
