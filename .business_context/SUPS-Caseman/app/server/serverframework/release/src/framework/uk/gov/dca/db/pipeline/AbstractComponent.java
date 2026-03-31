/*
 * Created on 27-Aug-2004
 *
 */
package uk.gov.dca.db.pipeline;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.Writer;
import java.sql.Connection;

import org.jdom.Document;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;
import uk.gov.dca.db.util.DBUtil;
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
	
    // Each component instance has a ComponentInput (m_inputData) - which is where it will read its' 
    // input from. It is also has a ComponentInput (m_outputData) - where it writes its'output.
    // These supercede "m_dataSrc" and "m_dataSink". However, they are used to continue supporting
    // the use of "m_dataSrc" and "m_dataSink" for backward compatibility.
    protected ComponentInput m_inputData = null;
    protected ComponentInput m_outputData = null;
    
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
		m_inputData = new ComponentInput( m_context.getInputConverterFactory() );
		m_parent.setSink( m_inputData );
	}
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#setSink(java.io.Writer)
	 */
	public void setSink( ComponentInput sink ) throws SystemException
	{
		m_outputData = sink;
		Writer outputWriter = new StringWriter();
		m_outputData.setData(outputWriter, Writer.class);
		m_dataSink = outputWriter;
	}
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#setContext(IComponentContext context)
	 */
	public void setContext(IComponentContext context) 
	{
		m_context = context;
	}
    
    public IComponentContext getContext() {
        return m_context;
    }
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#process(java.io.Writer, java.io.Writer)
	 */
    public void process(ComponentInput in, ComponentInput out) throws BusinessException, SystemException
    {
    	// check to see if we are the last component in the pipeline
    	if ( m_outputData == null )
    	{
    		m_outputData = out;

    		Writer outputWriter = new StringWriter();
    		m_outputData.setData(outputWriter, Writer.class);
    		m_dataSink = outputWriter;
    	}
    	
    	// check to see if we are the first component in the pipeline.
    	// if so then do the processing. If not then pass on to parent.
    	
		// NOTE: the code below means that if inheriting from AbstractComponent then ALWAYS get
    	// input converted to XMLWRITER_TYPE, even if in the subclass a call to ComponentInput.getData
    	// is made for a different input type. 
    	if ( m_parent == null )
    	{
    		m_inputData = in;
    		m_dataSrc = (Writer)m_inputData.getData( Writer.class );
    	}
    	else 
    	{
    		m_parent.setContext(m_context);
    		m_parent.process( in, out );
    		m_dataSrc = (Writer)m_inputData.getData( Writer.class );
    	}
    	
		process();
    }

    /**
     * Gets the input as a document object.
     * 
     * @return
     * @throws JDOMException
     * @throws IOException
     */
    public Document getInput() throws JDOMException, IOException {
        String sInput = m_dataSrc.toString();
        SAXBuilder builder = new SAXBuilder();
        Document input = builder.build( new StringReader(sInput) );
        return input;
    }
    
    
	
    
    protected abstract void process() throws BusinessException, SystemException;
    
    public void populateApplicationContext(Connection dbConnection) 
        throws SystemException, BusinessException 
    {
        DBUtil.populateApplicationContext(dbConnection, m_context);
    }
    
}
