/*
 * Created on Sep 15, 2005
 *
 */
package uk.gov.dca.db.pipeline.component_input;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Used by ComponentInput to convert the actual input format into the requested input
 * format.
 * 
 * @author GrantM
 *
 */
public interface InputConverter {

	/**
	 * Converts the passed input ,of class 'getFromClass', to the output, of class 'getToClass'
	 *   
	 * @param input
	 * @return
	 */
	Object convert(Object input) throws SystemException, BusinessException;
	
	/**
	 * Returns the class the converter accepts as input
	 *  
	 * @return
	 */
	Class getFromClass();
	
	/**
	 * Returns trhe class the converter returns as output
	 * 
	 * @return
	 */
	Class getToClass();
}
