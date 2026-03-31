/*
 * Created on Sep 15, 2005
 *
 */
package uk.gov.dca.db.pipeline.component_input;

import java.io.Writer;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * @author GrantM
 *
 */
public class WriterToStringConverter implements InputConverter {
	private Log log = SUPSLogFactory.getLogger(WriterToStringConverter.class);
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.component_input.InputConverter#convert(java.lang.Object)
	 */
	public Object convert(Object input) throws SystemException {
		String convertedInput = null;
		
		if (log.isDebugEnabled()){
			log.debug("Converting: "+this.getClass().getName());
		}
		
		if ( input != null)
		{
			Writer writer = null;
			try {
				writer = (Writer)input;
			}
			catch(Exception e) {
				throw new SystemException("Unable to convert Writer to String: "+e.getMessage(),e);
			}
			
			convertedInput = writer.toString();
		}	
		
		return convertedInput;
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.component_input.InputConverter#getFromClass()
	 */
	public Class getFromClass() {
		return Writer.class;
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.component_input.InputConverter#getToClass()
	 */
	public Class getToClass() {
		return String.class;
	}

}
