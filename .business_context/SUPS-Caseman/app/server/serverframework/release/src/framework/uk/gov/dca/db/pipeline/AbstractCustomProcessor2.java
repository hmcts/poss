/*
 * Created on 10-Jan-2005
 *
 */
package uk.gov.dca.db.pipeline;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;


/**
 * Provides a default base implementation of ICustomProcessor2.
 * This has been introduced so that in future it is easier to make interface changes
 * (provided that those changes can have a useful default implementation).
 * 
 * @author GrantM
 */
public abstract class AbstractCustomProcessor2 implements ICustomProcessor2 {

    protected IComponentContext m_context = null;
    
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ICustomProcessor#setContext(uk.gov.dca.db.pipeline.IComponentContext)
	 */
	public void setContext(IComponentContext context) {
		m_context = context;
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
