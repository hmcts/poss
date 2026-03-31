/*
 * Created on 10-Jan-2005
 *
 */
package uk.gov.dca.test_project.cases_service.classes;

import java.util.Map;
import java.io.IOException;

import org.jdom.Element;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractComponent;
import uk.gov.dca.db.pipeline.IGenerator;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;

/**
 * A class used to test the use of the component 'context'
 * 
 * @author GrantM
 *
 */
public class UserContextTestComponent extends AbstractComponent implements IGenerator {

	private final static String PRELOAD_CACHE_CONTEXT = "preload_context";
	private final static String PREPARE_CONTEXT = "prepare_context";
	private final static String TEST_USER_ITEM = "TEST_USER_ITEM";
	
	private Map m_preloadCache = null;
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.AbstractComponent#process()
	 */
	protected void process() throws BusinessException, SystemException {
		// this is only used to test the retreival of a previously added user context item
		try {
			String userItem = (String)m_context.getUserItem(TEST_USER_ITEM);
			
			XMLOutputter outputter = new XMLOutputter();
	    	
    		m_dataSink.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
			this.m_dataSink.write("<TestUserItem>"+userItem+"</TestUserItem>");		
		}
		catch(IOException e) {
			throw new SystemException("Error writing out user context data: "+e.getMessage(),e);
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
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#prepare(org.jdom.Element, java.util.Map)
	 */
	public void prepare(Element processingInstructions, Map preloadCache)
			throws SystemException {
	}
}
