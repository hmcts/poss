/*
 * Created on Sep 15, 2005
 *
 */
package uk.gov.dca.db.pipeline.component_input;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * @author GrantM
 *
 */
public class JDOMToStringConverter implements InputConverter {
	private Log log = SUPSLogFactory.getLogger(JDOMToStringConverter.class);

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.component_input.InputConverter#convert(java.lang.Object)
	 */
	public Object convert(Object input) throws SystemException
	{
		String convertedInput = null;
		
		if (log.isDebugEnabled()){
			log.debug("Converting: "+this.getClass().getName());
		}
		
		if ( input != null)
		{
			Document doc = null;
			try {
				doc = (Document)input;
			}
			catch(Exception e) {
				throw new SystemException("Unable to convert JDOM to String: "+e.getMessage(),e);
			}
			
			XMLOutputter outputter = new XMLOutputter();
			convertedInput = outputter.outputString(doc);
		}	
		
		return convertedInput;
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.component_input.InputConverter#getFromClass()
	 */
	public Class getFromClass() {
		return Document.class;
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.component_input.InputConverter#getToClass()
	 */
	public Class getToClass() {
		return String.class;
	}

}
