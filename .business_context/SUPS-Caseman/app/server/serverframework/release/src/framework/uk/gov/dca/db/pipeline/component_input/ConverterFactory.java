/*
 * Created on Sep 15, 2005
 *
 */
package uk.gov.dca.db.pipeline.component_input;

import uk.gov.dca.db.exception.SystemException;
import java.util.Map;
import java.util.TreeMap;

/**
 * Provides the requested InputConverter implementation.
 * 
 * @author GrantM
 */
public class ConverterFactory {

	private Map m_converterMap = null;
	
	public ConverterFactory()
	{
		m_converterMap = new TreeMap();
		
		// populate the map:
		addToConverterMap(new WriterToStringConverter());
		addToConverterMap(new WriterToJDOMConverter());
		addToConverterMap(new JDOMToStringConverter());
		addToConverterMap(new JDOMToWriterConverter());
		addToConverterMap(new StringToJDOMConverter());
		addToConverterMap(new StringToWriterConverter());
	}
	
	/**
	 * Returns the requested converter.
	 * 
	 * @param from
	 * @param to
	 * @return
	 * @throws SystemException
	 */
	InputConverter getConverter( Class from, Class to )
		throws SystemException
	{
		// sanity check input params
		if (from==null) {
			throw new SystemException("Cannot get requested coverter: No 'from' class provided");
		}
		if (to==null) {
			throw new SystemException("Cannot get requested coverter: No 'to' class provided");
		}
		
		// get the converter
		Object converterObj = m_converterMap.get( createKey(from,to) );
		
		if ( converterObj == null ) {
			throw new SystemException("Cannot get requested converter: Unsupported converter type from '"+from.getName()+"' to '"+to.getName()+"'");
		}
		return (InputConverter)converterObj;
	}
	
	/**
	 * Adds a converter to the map.
	 * 
	 * @param converter
	 */
	private void addToConverterMap( InputConverter converter ) 
	{
		m_converterMap.put( createKey( converter.getFromClass(), converter.getToClass()), converter);
	}
	
	/**
	 * Creates the map key for a given converter type.
	 * 
	 * @param from
	 * @param to
	 * @return
	 */
	private static final String createKey( Class from, Class to)
	{
		return from.getName()+"|"+to.getName();
	}
}
