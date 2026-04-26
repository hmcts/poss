/*
 * Created on 26-Oct-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.pipeline;

import java.io.IOException;
import java.io.StringReader;
import java.util.Map;

import javax.sql.DataSource;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import uk.gov.dca.db.exception.*;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;

/**
 * Service to create a lock.  This lock, once obtained, allows the current thread to enter a critical section of the service method.  
 * This means that only a single thread may enter the critical section at any one time.
 * 
 * @author JamesB
 */
public class LockingService extends AbstractComponent implements IGenerator {

	/**
	 * Attempts to obtain a lock for the current thread to enter a critical section.  If another thread has already entered the critical
	 * section then the current thread will wait until the lock is released i.e. the thread currently holding the lock exits the 
	 * critical section.
	 * 
	 * @see uk.gov.dca.db.pipeline.AbstractComponent#process()
	 */
	protected void process() throws SystemException, BusinessException {
		
		StringReader reader = new StringReader(m_dataSrc.toString());
		SAXBuilder builder = new SAXBuilder();
		Document doc = null;
		try {
			doc = builder.build(reader);
		}
		catch(IOException e) {
			throw new SystemException("Unable to read pipeline component input: "+e.getMessage(),e);
		}
		catch(JDOMException e) {
			throw new BusinessException("Unable to process pipeline component input: "+e.getMessage(),e);
		}
		
		Element root = doc.getRootElement();
		String lockId = idGenerator.generateLockId(root);
		monitor.obtain(lockId);
		
		try {
			m_dataSink.write(m_dataSrc.toString());
		}
		catch(IOException e) {
			throw new SystemException("Write to data sink failed: "+e.getMessage(), e);
		}
	}

	/**
	 * Allows the component to validate the processing instructions specified for the call in the method descriptor file.
	 * 
	 * @see uk.gov.dca.db.pipeline.IComponent#validate(java.lang.String, uk.gov.dca.db.queryengine.QueryEngineErrorHandler, org.jdom.Element, java.util.Map)
	 */
	public void validate(String methodId, QueryEngineErrorHandler handler,
			Element processingInstructions, Map preloadCache)
		throws SystemException 
	{
		
		// TODO The code in this method should probably be made more generic and shared with the prepare method rather than duplicated
		
		// get the attribute of the wait element
		String waitValue = processingInstructions.getAttributeValue("wait");
		if(waitValue != null) {
			if(!(waitValue.toUpperCase().equals(TRUE_VALUE.toUpperCase()) || waitValue.toUpperCase().equals(FALSE_VALUE.toUpperCase()))) {
				StringBuffer msg = new StringBuffer(waitValue);
				msg.append(" is not a valid value for the value attribute of the wait node.  Acceptable values are ");
				msg.append(TRUE_VALUE);
				msg.append(" and ");
				msg.append(FALSE_VALUE);
				
				handler.raiseError(msg.toString());
			}
		}
		
		// get the datasource element
		Element datasource = processingInstructions.getChild("datasource");
		if(datasource == null) {
			handler.raiseError("Datasource node missing for " + getName());
		}
		
		// get the id attribute of the datasource
		dataSourceId = datasource.getAttributeValue("id");
		if(dataSourceId == null) {
			handler.raiseError("id attribute missing for datasource node");
		}
					
		// get the lockId element
		Element lockIdElement = processingInstructions.getChild("lockId");
		if(lockIdElement == null) {
			handler.raiseError("LockId node missing for " + getName());
		}
		
		// get the generator or the expression attribute of the lockId element
		lockIdGenerator = lockIdElement.getAttributeValue("generator");
		lockIdExpression = lockIdElement.getAttributeValue("expression");
		if((lockIdExpression == null && lockIdGenerator == null) || (lockIdExpression != null && lockIdGenerator != null)) {
			handler.raiseError("Either an expression or generator must be specified for the lockId node");
		}
	}

	/**
	 * Since the LockingService component does not require anything to be preloaded into the cache, this method does nothing.
	 * 
	 * @see uk.gov.dca.db.pipeline.IComponent#preloadCache(org.jdom.Element, java.util.Map)
	 */
	public void preloadCache(Element processingInstructions, Map preloadCache) {
		// empty
	}

	/**
	 * Parses the processing instructions for this component and prepares for the processing.
	 * 
	 * @see uk.gov.dca.db.pipeline.IComponent#prepare(org.jdom.Element, java.util.Map)
	 */
	public void prepare(Element processingInstructions, Map preloadCache) throws SystemException {
		parseProcessingInstructions(processingInstructions);
		initialise(preloadCache);
	}
		
	private void parseProcessingInstructions(Element processingInstructions) throws SystemException {
		// get the wait attribute
		String waitValue = processingInstructions.getAttributeValue("wait");
		if(waitValue != null) {
			if(waitValue.toUpperCase().equals(FALSE_VALUE.toUpperCase())) {
				wait = false;
			}
			else if(!waitValue.toUpperCase().equals(TRUE_VALUE.toUpperCase())) {
				StringBuffer msg = new StringBuffer(waitValue);
				msg.append(" is not a valid value for the value attribute.  Acceptable values are ");
				msg.append(TRUE_VALUE);
				msg.append(" and ");
				msg.append(FALSE_VALUE);
				
				throw new ConfigurationException(msg.toString());
			}
		}
		
		// get the datasource element
		Element datasource = processingInstructions.getChild("datasource");
		if(datasource == null) {
			throw new ConfigurationException("'datasource' node missing for '" + getName()+"'");
		}
		
		// get the id attribute of the datasource
		dataSourceId = datasource.getAttributeValue("id");
		if(dataSourceId == null) {
			throw new ConfigurationException("'id' attribute missing for 'datasource' node for '" + getName()+"'");
		}
		
		// get the lock table attribute of the datasource
		lockTableName = datasource.getAttributeValue("table", DEFAULT_LOCK_TABLE_NAME);
		
		// get the lockId element
		Element lockIdElement = processingInstructions.getChild("lockId");
		if(lockIdElement == null) {
			throw new ConfigurationException("'LockId' node missing for '" + getName()+"'");
		}
		
		// get the generator or the expression attribute of the lockId element
		lockIdGenerator = lockIdElement.getAttributeValue("generator");
		lockIdExpression = lockIdElement.getAttributeValue("expression");
		if((lockIdExpression == null && lockIdGenerator == null) || (lockIdExpression != null && lockIdGenerator != null)) {
			throw new ConfigurationException("Either an expression or generator must be specified for the lockId node");
		}	
	}
		
	private void initialise(Map preloadCache) throws SystemException {
		
		// load the datasource
		DataSource dataSource = (DataSource) preloadCache.get(dataSourceId);
		if(dataSource == null) {
			throw new SystemException("Assertion Failed: datasource not found: " + dataSourceId);
		}

		// create the monitor
		monitor = new Lock(dataSource, lockTableName, wait);
		
		// load the lockIdGenerator
		LockIdGeneratorFactory generatorFactory = new LockIdGeneratorFactory();
		if(lockIdGenerator != null) {
			idGenerator = generatorFactory.createCustomGenerator(lockIdGenerator);
		}
		else if(lockIdExpression != null) {
			idGenerator = generatorFactory.createExpressionBasedGenerator(lockIdExpression);
		}
		else {
			throw new ConfigurationException("Assertion Failed: neither lockIdGenerator or lockIdExpression specified");
		}
	}
	
	// constants
	private static final String FALSE_VALUE = Boolean.FALSE.toString();
	private static final String TRUE_VALUE = Boolean.TRUE.toString();
	
	private static final String DEFAULT_LOCK_TABLE_NAME = "locking_table";
	
	// attributes
	private String dataSourceId = null;
	private String lockIdGenerator = null;
	private String lockIdExpression = null;
	private String lockTableName = null;
	private boolean wait = true;
	
	private LockIdGenerator idGenerator = null;
	private Lock monitor = null;
}
