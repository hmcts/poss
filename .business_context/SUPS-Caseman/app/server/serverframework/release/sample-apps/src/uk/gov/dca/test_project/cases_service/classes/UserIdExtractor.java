/*
 * Created on 07-Dec-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.test_project.cases_service.classes;

import java.io.Writer;
import java.io.IOException;

import org.apache.commons.logging.Log;
import org.jdom.JDOMException;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.exception.*;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class UserIdExtractor extends AbstractCustomProcessor {

	/**
	 * 
	 */
	public UserIdExtractor() {
		super();
		// TODO Auto-generated constructor stub
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer, org.apache.commons.logging.Log)
	 */
	public void process(Document inputParameters, Writer output, Log log)
			throws BusinessException, SystemException {
		//simple example to show logging and outputting
		log.debug("Starting process in TestCustomProcessor");
		try {
			output.write("<output>");
		}
		catch( IOException e) {
			throw new SystemException("Unable to write to output: " +e.getMessage(), e);
		}
		
		Element param = null;
		try {
			param = (Element) XPath.selectSingleNode(inputParameters, "/params/param[@name='userId']");
		}
		catch (JDOMException e) {
			throw new BusinessException("Unable to write to retrieve input parameter \"/params/param[@name='userId']\"",e);
		}
		try {
			output.write("<xmlUserId>");
			output.write(param.getTextNormalize());
			output.write("</xmlUserId>");
			
			write(output, "contextUserId", IComponentContext.USER_ID_KEY);
			write(output, "contextCourtId", IComponentContext.COURT_ID_KEY);
			write(output, "contextBusinessProcessId", IComponentContext.BUSINESS_PROCESS_ID_KEY);
			
		}
		catch( IOException e) {
			throw new SystemException("Unable to write to output: " +e.getMessage(), e);
		}
		try {
			output.write("</output>");
		}
		catch( IOException e) {
			throw new SystemException("Unable to write to output: " +e.getMessage(), e);
		}
		log.debug("process(): output:" + output.toString());
		log.debug("Finished process in TestCustomProcessor");
	}
	
	private void write(Writer output, String elementName, String contextKey) throws IOException {
		output.write('<' + elementName + '>');
		output.write((String) m_context.getSystemItem(contextKey));
		output.write("</" + elementName + '>');
	}

}
