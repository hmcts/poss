/*
 * Created on Sep 14, 2005
 *
 */
package uk.gov.dca.db.pipeline.component_input;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * A class to encapsulate data and behaviour associated with passing the output from
 * one component into the input of the next.
 * 
 * @author GrantM
 *
 */
public class ComponentInput {
	
	private ConverterFactory m_converterFactory = null;
	private Class m_currentInputType = null;
	private Object m_currentData = null;
	private Log log = SUPSLogFactory.getLogger(ComponentInput.class);
	
	public ComponentInput(ConverterFactory converterFactory)
		throws SystemException
	{
		if (converterFactory==null) {
			throw new SystemException("Cannot instantiate ComponentInput: No ConverterFactory provided");
		}
		m_converterFactory = converterFactory;
	}
	
	/**
	 * Sets the current data.
	 * 
	 * @param input - the data to be encapsulated.
	 * @param typeId - the full Java classpath of the input object. Typically the lowest
	 * 		level useful base class or interface.
	 * @throws SystemException
	 */
	public void setData(Object input, Class typeId) 
		throws SystemException
	{
		if ( typeId == null){
			throw new SystemException("Cannot set input data: No data type specified");
		}
		
		// allow 'null' data value
		m_currentData = input;
		m_currentInputType = typeId;
	}
	
	/**
	 * Convenience method for passing through data from one component to the next.
	 * 
	 * @param data
	 * @throws SystemException
	 */
	public void setData(ComponentInput data) 
		throws SystemException
	{
		if ( data.m_currentInputType == null){
			throw new SystemException("Cannot set input data: No data type specified");
		}
		
		m_currentData = data.m_currentData;
		m_currentInputType = data.m_currentInputType;
	}
	
	/**
	 * Returns the encapsulated data in the requested format, performing any conversion
	 * processing required.
	 * 
	 * @param typeId
	 * @return
	 * @throws SystemException
	 * @throws BusinessException
	 */
	public Object getData(Class typeId)
		throws SystemException, BusinessException
	{
		// try to provide current data as the requested type.
		// this may mean converting it.
		Object data = m_currentData;
		
		if ( m_currentInputType == null){
			throw new SystemException("Cannot return component input data: No source data type specified");
		}
		if ( typeId == null){
			throw new SystemException("Cannot return component input data: No data type specified");
		}
		
		if ( m_currentData != null &&
				m_currentInputType.getName().compareToIgnoreCase(typeId.getName()) != 0 )
		{
			//convert data format. If the converter cannot be found then the factory throws an exception
			InputConverter converter = m_converterFactory.getConverter(m_currentInputType, typeId);
			data = converter.convert(m_currentData);
		}
		else if (log.isDebugEnabled()) 
		{
			log.debug("Pass through: src="+m_currentInputType+", sink="+typeId);
		}
		
		return data;
	}
	
	/* FOR THE FUTURE - components build their output with a common interface but what this
	 * builds is determined by the next component in the pipeline i.e. the data is passed by
	 * building it in the desired format rather than building in one form and then converting it 
	 * to another. Useful when creating entirely new output (e.g. querying DB).
	 * 'setData' is still needed for components that pass through their data (mostly) unchanged. 
	 * 
	 * The use of "StringWriter" is also really an example of a data writer (i.e. it is not the data itself)
	 * but we do not want the standard data writer to have a "Writer" interface. That is why "Writer"
	 * is handled as data.
	 * 
	 * Suggested method signature: 
	public ContentHandler getDataWriter()
	{
		
	}
	*/
}
