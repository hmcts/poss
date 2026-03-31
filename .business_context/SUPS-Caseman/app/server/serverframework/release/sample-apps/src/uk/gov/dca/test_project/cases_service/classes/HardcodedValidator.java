/*
 * Created on 29-Jun-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.test_project.cases_service.classes;

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;

/**
 * @author Administrator
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class HardcodedValidator extends AbstractCustomProcessor {

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer, org.apache.commons.logging.Log)
	 */
	public void process(Document inputParameters, Writer output, Log log) throws BusinessException, SystemException {
		
		Element validation = null;
		String value = "";
		
		try {
			Thread.sleep(5000);
		} catch(java.lang.InterruptedException ie) {
			
		}
		
		try {
			validation = (Element)XPath.selectSingleNode(inputParameters, "/params/param[@name='validation']");
			
			if(validation != null) {
				value = validation.getValue();

			 	if(value.equals("NoError")) {
			 		output.write("<NoError/>");
			 	}
			 	else if(!value.equals("")) {
					output.write("<ErrorCode>");
					output.write(value);
					output.write("</ErrorCode>");
				}
			}
		}
		catch(JDOMException e){
			throw new BusinessException("Failed to retrieve input parameter 'validation': "+e.getMessage(),e);
		} 
		catch (IOException e) {
			throw new SystemException(e);
		}
		
	}

}
