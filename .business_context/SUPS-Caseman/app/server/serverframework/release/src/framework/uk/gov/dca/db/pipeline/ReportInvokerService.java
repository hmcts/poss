/*
 * Created on Jul 28, 2005
 *
 */
package uk.gov.dca.db.pipeline;

import java.util.Map;
import java.util.regex.Matcher;

import javax.sql.DataSource;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.async.QueueHandler;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.queryengine.QueryEngineException;
import uk.gov.dca.db.reports.ReportInvoker;

/**
 * A component used to queue a report request to the report server.
 * Expected config of form:
 * 
 * <InvokeReport project="" xpath="/params/param[@name='']">
 * 		<ReportStore id=""/>
 * 		<Destination/>
 * </InvokeReport>
 * 
 * 
 * 
 * @author GrantM
 *
 */
public class ReportInvokerService extends AbstractComponent2 implements IGenerator {

	private static final String DESTINATION_ELEMENT = "Destination";
	private static final String DATASOURCE_ELEMENT = "ReportStore";
	private static final String ID_ATTR = "id";
	private static final String PROJECT_ATTR = "project";
	private static final String XPATH_ATTR = "xpath";
	private static final String XML_HEADER = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n";

	private String m_project;
	private String m_destination;
	private String m_inputXPath;
	private DataSource m_reportQueueStore;
	private QueueHandler m_queueHandler;
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.AbstractComponent#process()
	 */
	protected void process() throws BusinessException, SystemException {
		Document parameters = (Document)this.m_inputData.getData(Document.class);
        		
		Element reportRequest = null;
		try {
			Element reportParam = (Element)XPath.selectSingleNode(parameters, m_inputXPath);
            if (reportParam.getChildren().size() > 0) {
                reportRequest = (Element) reportParam.getChildren().get(0);
            }
		}
		catch(JDOMException e) {
			throw new BusinessException("Unable to find report request using XPath '"+m_inputXPath+"'");
		}
		
		if ( reportRequest == null ) {
			throw new BusinessException("Unable to find report request using XPath '"+m_inputXPath+"'");
		}

        String userId = (String) m_context.getSystemItem(IComponentContext.USER_ID_KEY);
        String courtId = (String) m_context.getSystemItem(IComponentContext.COURT_ID_KEY);
        
		ReportInvoker invoker = new ReportInvoker(this.m_reportQueueStore);
		String requestReferenceXML = invoker.queueReportRequest(reportRequest, m_queueHandler, m_project, userId, courtId);
		
		this.m_outputData.setData( XML_HEADER+requestReferenceXML, String.class);
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#validate(java.lang.String, uk.gov.dca.db.queryengine.QueryEngineErrorHandler, org.jdom.Element, java.util.Map)
	 */
	public void validate(String methodId, QueryEngineErrorHandler handler,
			Element processingInstructions, Map preloadCache)
			throws SystemException 
	{
		readProcessingInstructions(processingInstructions, preloadCache);
		validateConfig(methodId+": ", handler);
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#preloadCache(org.jdom.Element, java.util.Map)
	 */
	public void preloadCache(Element processingInstructions, Map preloadCache)
			throws SystemException {
		// Nothing to preload
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#prepare(org.jdom.Element, java.util.Map)
	 */
	public void prepare(Element processingInstructions, Map preloadCache)
			throws SystemException 
	{
		readProcessingInstructions(processingInstructions, preloadCache);
		validateConfig(null,null);
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
		// read in XML cfg
		if (processingInstructions == null) {
			throw new SystemException("No processing instructions passed to '"+this.getName()+"'");
		}
		
		String propStr = processingInstructions.getAttributeValue(PROJECT_ATTR);
        Matcher propM = Query.s_variablePattern.matcher(propStr);
        
        if (propM.find()) {
            String prop = propM.group(1);
            m_project = (String) preloadCache.get(prop);
            if (m_project == null) {
                throw new SystemException("Property: " + prop + " is not defined in the project_config.xml");
            }
        }
        else {
            throw new SystemException("The project field must be a property defined in the format ${uk.gov.dca.<project>.reportConfig}");
        }
        
		m_inputXPath = processingInstructions.getAttributeValue(XPATH_ATTR);
		m_destination = processingInstructions.getChildText(DESTINATION_ELEMENT);
		
		if (m_destination != null && m_destination.length() > 0) {
			m_queueHandler = (QueueHandler)preloadCache.get(m_destination);
		}
		
		Element dataSrcElement = processingInstructions.getChild(DATASOURCE_ELEMENT);
		if ( dataSrcElement != null ) 
		{
			String dsId = dataSrcElement.getAttributeValue(ID_ATTR);
			if ( dsId != null && dsId.length() > 0)
			{
				m_reportQueueStore = (DataSource)preloadCache.get(dsId);
			}
		}
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
		String preface = "";
		if ( msgPreface != null )
		{
			preface = msgPreface;
		}
		
		if ( m_project == null || m_project.length() == 0) {
			raiseError(preface+"'"+PROJECT_ATTR+"' attribute required by '"+this.getName()+"'", handler);
		}
		
		if ( m_inputXPath == null || m_inputXPath.length() == 0) {
			raiseError(preface+"'"+XPATH_ATTR+"' attribute required by '"+this.getName()+"'", handler);
		}
		
		if ( m_destination == null || m_destination.length() == 0) {
			raiseError(preface+"'"+DESTINATION_ELEMENT+"' element required by '"+this.getName()+"'", handler);
		}
		
		if ( m_queueHandler == null ) {
			raiseError(preface+"Unable to find queue handler with id='"+DESTINATION_ELEMENT+"'", handler);
		}
		
		if ( m_reportQueueStore == null ) {
			raiseError(preface+"'"+DATASOURCE_ELEMENT+"' element required by '"+this.getName()+"'", handler);
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
}
