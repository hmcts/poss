/*
 * Created on 29-Oct-2004
 *
 */
package uk.gov.dca.db.pipeline;

import java.util.Map;

import org.apache.commons.logging.Log;
import org.jdom.Element;

import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.exception.*;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * This service implements a delay or sleep function for the pipeline that may be used during testing.
 * 
 * @author JamesB
 */
public class WaitService extends AbstractComponent2 implements IGenerator {

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.AbstractComponent#process()
	 */
	protected void process() throws SystemException, BusinessException
	{
		try {
			log.debug("Sleeping for " + delay);
			Thread.sleep(delay);
			log.debug("Waking up");
			
			this.m_outputData.setData( this.m_inputData );
		}
		catch(InterruptedException e) {
			log.warn("Sleep interrupted", e);
		}
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#validate(java.lang.String, uk.gov.dca.db.queryengine.QueryEngineErrorHandler, org.jdom.Element, java.util.Map)
	 */
	public void validate(String methodId, QueryEngineErrorHandler handler,
			Element processingInstructions, Map preloadCache)
	{
		// empty
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#preloadCache(org.jdom.Element, java.util.Map)
	 */
	public void preloadCache(Element processingInstructions, Map preloadCache)
	{
		// empty
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#prepare(org.jdom.Element, java.util.Map)
	 */
	public void prepare(Element processingInstructions, Map preloadCache)
		throws ConfigurationException 
	{
		String delayString = null;
		try {
			delayString = processingInstructions.getAttributeValue("delay");
			
			if(delayString == null || delayString.equals("")) {
				throw new ConfigurationException("'delay' attribute must must be specified for element '"+this.getName()+"'");
			}
			delay = Long.parseLong(delayString);
		}
		catch(NumberFormatException e) {
			throw new ConfigurationException("The specified delay '"+delayString+"' for '"+this.getName()+"' is not a valid number");
		}
	}
	
	private long delay;

	private static final Log log = SUPSLogFactory.getLogger(WaitService.class);
}
