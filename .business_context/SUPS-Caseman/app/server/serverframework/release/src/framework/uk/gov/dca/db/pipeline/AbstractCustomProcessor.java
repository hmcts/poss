/*
 * Created on 10-Jan-2005
 *
 */
package uk.gov.dca.db.pipeline;

import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;


/**
 * Provides a default base implementation of ICustomProcessor.
 * This has been introduced so that in future it is easier to make interface changes
 * (provided that those changes can have a useful default implementation).
 * 
 * @author GrantM
 */
public abstract class AbstractCustomProcessor implements ICustomProcessor {

    protected IComponentContext m_context = null;
    
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ICustomProcessor#setContext(uk.gov.dca.db.pipeline.IComponentContext)
	 */
	public void setContext(IComponentContext context) {
		m_context = context;
	}

	/**
	 * Default implementation that does nothing.
	 */
	public void process(Document inputParameters, Writer output, Log log) 
		throws BusinessException, SystemException
	{
		// do nothing
		throw new SystemException("Old style 'process' method has no implementation");
	}
	
	/**
	 * Default implementation that does nothing in order to maintain backwards compatability.
	 */
	public void process(ComponentInput inputParameters, ComponentInput output, Log log) 
		throws BusinessException, SystemException
	{
		// do nothing
		throw new SystemException("New style 'process' method has no implementation");
	}

}
