/*
 * Created on 26-Oct-2004
 *
 */
package uk.gov.dca.test_project.cases_service.classes;

import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.output.XMLOutputter;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.exception.*;
import java.io.IOException;

/**
 * @author GrantM
 *
 */
public class TestCustomProcessor extends AbstractCustomProcessor {

	public TestCustomProcessor() {
		super();
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer, org.apache.commons.logging.Log)
	 */
	public void process(Document inputParameters, Writer output, Log log)
		throws BusinessException, SystemException
	{
		// simple example to show logging and outputting
		log.debug("Starting process in TestCustomProcessor");
		
		try {
			output.write("<output service='"+m_context.getSystemItem("service_name")+
					"' method='"+m_context.getSystemItem("method_name")+"'>");
		}
		catch (IOException e){
			throw new SystemException("Unable to write to output: " + e.getMessage(),e);
		}
		
		XMLOutputter outputter = new XMLOutputter();
		
		try {
			outputter.output( inputParameters.getRootElement(), output );
		}
		catch (IOException e){
			throw new SystemException("Unable to write to output: " + e.getMessage(),e);
		}
		try {
			output.write("</output>");
		}
		catch (IOException e){
			throw new SystemException("Unable to write to output: " + e.getMessage(),e);
		}
		
		log.debug("Finished process in TestCustomProcessor");
	}

}
