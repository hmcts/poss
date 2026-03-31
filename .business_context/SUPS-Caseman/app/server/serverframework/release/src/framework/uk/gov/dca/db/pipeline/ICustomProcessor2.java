/*
 * Created on 26-Oct-2004
 *
 */
package uk.gov.dca.db.pipeline;

import org.apache.commons.logging.Log;
import uk.gov.dca.db.exception.*;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;

/**
 * Interface definition for pipeline-able Java based plug-in processor 
 * 
 * @author Grant Miller
 */
public interface ICustomProcessor2 {
	/**
	 * Sets the context. See 'IComponentContext' for more details.
	 * @param context
	 */
	public void setContext(IComponentContext context);
	
	/**
	 * Performs the custom processing. Alternative form that should allow more efficient passing
	 * of parameters.
	 * 
	 * @param inputParameters
	 * @param output
	 * @param log
	 * @throws BusinessException
	 * @throws SystemException
	 */
	public void process(ComponentInput inputParameters, ComponentInput output, Log log) throws BusinessException, SystemException;
}
