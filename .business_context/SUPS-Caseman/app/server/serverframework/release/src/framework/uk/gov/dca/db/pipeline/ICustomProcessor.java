/*
 * Created on 26-Oct-2004
 *
 */
package uk.gov.dca.db.pipeline;

import org.jdom.Document;
import java.io.Writer;
import org.apache.commons.logging.Log;
import uk.gov.dca.db.exception.*;

/**
 * Interface definition for pipeline-able Java based plug-in processor 
 * 
 * @author Grant Miller
 */
public interface ICustomProcessor {
	/**
	 * Sets the context. See 'IComponentContext' for more details.
	 * @param context
	 */
	public void setContext(IComponentContext context);
	
	/**
	 * Performs the custom processing.
	 * 
	 * @param inputParameters
	 * @param output
	 * @param log
	 * @throws BusinessException
	 * @throws SystemException
	 */
	public void process(Document inputParameters, Writer output, Log log) throws BusinessException, SystemException;
}
