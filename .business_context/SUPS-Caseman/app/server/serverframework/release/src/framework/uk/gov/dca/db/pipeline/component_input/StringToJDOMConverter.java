/*
 * Created on Sep 15, 2005
 *
 */
package uk.gov.dca.db.pipeline.component_input;

import java.io.IOException;
import java.io.StringReader;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * @author GrantM
 *
 */
public class StringToJDOMConverter implements InputConverter {
	private Log log = SUPSLogFactory.getLogger(StringToJDOMConverter.class);

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.component_input.InputConverter#convert(java.lang.Object)
	 */
	public Object convert(Object input) throws SystemException,
			BusinessException 
	{
		Document convertedInput = null;
		
		if (log.isDebugEnabled()){
			log.debug("Converting: "+this.getClass().getName());
		}
		
		if ( input != null)
		{
			String stringInput = null;
			try {
				stringInput = (String)input;
			}
			catch(Exception e) {
				throw new SystemException("Unable to convert String to JDOM: "+e.getMessage(),e);
			}
			
			// create XML from the input
			SAXBuilder builder = new SAXBuilder();
			try {
				convertedInput = builder.build( new StringReader( stringInput ) );
			}
			catch( IOException e ) {
	    		throw new SystemException("Unable to convert String to JDOM: "+e.getMessage(),e);
			}
			catch( JDOMException e ) {
	    		throw new BusinessException("Unable to convert String to JDOM: "+e.getMessage(),e);
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
		return Document.class;
	}

}
