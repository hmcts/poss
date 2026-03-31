/*
 * Created on 27-Aug-2004
 *
 */
package uk.gov.dca.db.pipeline;

import java.io.Writer;
import java.io.StringWriter;
import uk.gov.dca.db.exception.*;
/**
 * Provides default implementations for IComponent methods and any common
 * helper methods.
 * 
 * @author Grant Miller
 */
public abstract class AbstractComponent implements IComponent {

	protected String m_name = null;
    protected Writer m_dataSink = null;
    protected Writer m_dataSrc = null;
    protected IComponent m_parent = null;
    protected IComponentContext m_context = null;
	
    /* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#setName(uk.gov.dca.db.pipeline.IComponent)
	 */
    public void setName(String name)
    {
    	m_name = name;
    }
	
    /* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#getName(uk.gov.dca.db.pipeline.IComponent)
	 */
    public String getName()
    {
    	return m_name;
    }
	
    /* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#setParent(uk.gov.dca.db.pipeline.IComponent)
	 */
	public void setParent( IComponent parent ) throws SystemException
	{
		m_parent = parent;
		m_dataSrc = new StringWriter();
		m_parent.setSink( m_dataSrc );
	}
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#setSink(java.io.Writer)
	 */
	public void setSink( Writer sink ) throws SystemException
	{
		m_dataSink = sink;
	}
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#setContext(IComponentContext context)
	 */
	public void setContext(IComponentContext context) 
	{
		m_context = context;
	}
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#process(java.io.Writer, java.io.Writer)
	 */
    public void process(Writer in, Writer out) throws BusinessException, SystemException
    {
    	// check to see if we are the last component in the pipeline
    	if ( m_dataSink == null )
    	{
    		m_dataSink = out;
    	}
    	// check to see if we are the first component in the pipeline.
    	// if so then do the processing. If not then pass on to parent.
    	if ( m_parent == null )
    		m_dataSrc = in;
    	else {
    		m_parent.setContext(m_context);
    		m_parent.process( in, out );
    	}
    	
    	process();
    }
	
    protected abstract void process() throws BusinessException, SystemException;
    
}
