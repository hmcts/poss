/*
 * Created on 10-Jan-2005
 *
 */
package uk.gov.dca.db.pipeline;


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

}
