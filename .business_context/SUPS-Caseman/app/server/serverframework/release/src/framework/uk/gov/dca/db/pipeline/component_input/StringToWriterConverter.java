/*
 * Created on Sep 15, 2005
 *
 */
package uk.gov.dca.db.pipeline.component_input;


import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * @author GrantM
 *
 */
public class StringToWriterConverter implements InputConverter {
	private Log log = SUPSLogFactory.getLogger(StringToWriterConverter.class);

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.component_input.InputConverter#convert(java.lang.Object)
	 */
	public Object convert(Object input) throws SystemException,
			BusinessException 
	{
		Writer convertedInput = null;
		
		if (log.isDebugEnabled()){
			log.debug("Converting: "+this.getClass().getName());
		}
		
		if ( input != null)
		{
			convertedInput = new StringWriter();
			
			String stringInput = null;
			try {
				stringInput = (String)input;
			}
			catch(Exception e) {
				throw new SystemException("Unable to convert String to Writer: "+e.getMessage(),e);
			}
			
			try {
				convertedInput.write(stringInput);
			}
			catch(IOException e) {
				throw new SystemException("Unable to convert String to Writer: "+e.getMessage(),e);
			}
		}	
		
		return convertedInput;
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.component_input.InputConverter#getFromClass()
	 */
	public Class getFromClass() {
		return String.class;
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.component_input.InputConverter#getToClass()
	 */
	public Class getToClass() {
		return Writer.class;
	}

}
